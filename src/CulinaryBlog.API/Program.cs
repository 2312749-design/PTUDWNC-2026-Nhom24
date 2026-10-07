using CulinaryBlog.API.Middleware;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Application.Models;
using CulinaryBlog.Infrastructure.Persistence;
using CulinaryBlog.Infrastructure.Services;
using Hangfire;
using Hangfire.PostgreSql;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Minio;
using Npgsql;
using OpenTelemetry.Exporter;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using StackExchange.Redis;
using System.Diagnostics;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var serviceName = builder.Configuration["OpenTelemetry:ServiceName"] ?? "culinary-blog-api";

builder.Host.UseSerilog((context, services) =>
    services
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Application", serviceName)
        .Enrich.WithProperty("Environment", context.HostingEnvironment.EnvironmentName));

// 1. Cấu hình DbContext kết nối PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký IApplicationDbContext ánh xạ vào ApplicationDbContext (Phục vụ Clean Architecture)
builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

var minioOptions = builder.Configuration.GetSection("Minio").Get<MinioOptions>()
    ?? new MinioOptions();
builder.Services.AddOptions<MinioOptions>().Bind(builder.Configuration.GetSection("Minio"));

builder.Services.AddSingleton<IMinioClient>(serviceProvider =>
    CulinaryBlog.Infrastructure.Services.MinioClientFactory.Create(
        serviceProvider.GetRequiredService<IOptions<MinioOptions>>()));
builder.Services.AddScoped<IFileStorageService>(serviceProvider =>
    minioOptions.Enabled
        ? new MinioFileStorageService(
            serviceProvider.GetRequiredService<IMinioClient>(),
            serviceProvider.GetRequiredService<IOptions<MinioOptions>>())
        : new LocalFileStorageService(
            serviceProvider.GetRequiredService<IWebHostEnvironment>(),
            builder.Configuration));

var redisConnectionString = builder.Configuration.GetConnectionString("Redis");
var redisConnection = string.IsNullOrWhiteSpace(redisConnectionString)
    ? null
    : ConnectionMultiplexer.Connect(redisConnectionString);

builder.Services.AddSingleton<IConnectionMultiplexer>(_ => redisConnection!);
builder.Services.AddSingleton<ICacheService>(_ =>
    redisConnection is null
        ? new NoOpCacheService()
        : new RedisCacheService(redisConnection));

var healthChecks = builder.Services.AddHealthChecks();
healthChecks.AddCheck("self", () => HealthCheckResult.Healthy(), ["live"]);
healthChecks.AddCheck("database", () =>
{
    try
    {
        using var connection = new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
        connection.Open();
        return HealthCheckResult.Healthy("PostgreSQL is reachable.");
    }
    catch (Exception exception)
    {
        return HealthCheckResult.Unhealthy("PostgreSQL is unavailable.", exception);
    }
});
healthChecks.AddCheck("redis", () =>
{
    if (redisConnection is null)
    {
        return HealthCheckResult.Healthy("Redis cache is disabled.");
    }

    return redisConnection.IsConnected
        ? HealthCheckResult.Healthy("Redis is reachable.")
        : HealthCheckResult.Unhealthy("Redis is unavailable.");
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("default", limiterOptions =>
    {
        limiterOptions.PermitLimit = builder.Configuration.GetValue("RateLimiting:DefaultPermitLimit", 200);
        limiterOptions.Window = TimeSpan.FromMinutes(builder.Configuration.GetValue("RateLimiting:DefaultWindowMinutes", 1));
        limiterOptions.QueueLimit = 0;
    });
    options.AddFixedWindowLimiter("auth", limiterOptions =>
    {
        limiterOptions.PermitLimit = builder.Configuration.GetValue("RateLimiting:LoginPermitLimit", 5);
        limiterOptions.Window = TimeSpan.FromMinutes(builder.Configuration.GetValue("RateLimiting:LoginWindowMinutes", 1));
        limiterOptions.QueueLimit = 0;
    });
});

var openTelemetry = builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource.AddService(
        serviceName,
        serviceVersion: typeof(Program).Assembly.GetName().Version?.ToString()))
    .WithTracing(tracing => tracing
        .AddSource(serviceName)
        .AddAspNetCoreInstrumentation(options => options.EnrichWithHttpRequest =
            (activity, request) => activity.SetTag("http.request.id", request.HttpContext.TraceIdentifier))
        .AddHttpClientInstrumentation())
    .WithMetrics(metrics => metrics
        .AddMeter(serviceName)
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation());

var otlpEndpoint = builder.Configuration["OpenTelemetry:OtlpEndpoint"];
if (!string.IsNullOrWhiteSpace(otlpEndpoint))
{
    openTelemetry.WithTracing(tracing => tracing.AddOtlpExporter(options =>
        ConfigureOtlpExporter(options, otlpEndpoint)));
    openTelemetry.WithMetrics(metrics => metrics.AddOtlpExporter(options =>
        ConfigureOtlpExporter(options, otlpEndpoint)));
}

// 2. Bind JwtSettings từ appsettings.json
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

// 3. Đăng ký TokenService vào DI Container
builder.Services.AddScoped<ITokenService, TokenService>();

// 4. Cấu hình Authentication & JWT Bearer
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
var key = Encoding.UTF8.GetBytes(jwtSettings!.Secret);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

// 5. Cấu hình CORS cho Frontend React chạy ở localhost:3000
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
                origin.StartsWith("http://localhost:") ||
                origin.StartsWith("http://127.0.0.1:") ||
                origin.StartsWith("https://localhost:") ||
                origin.StartsWith("https://127.0.0.1:"))
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Đăng ký MediatR tự động quét các Handler trong tầng Application
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CulinaryBlog.Application.DTOs.CategoryDto).Assembly));

builder.Services.AddControllers();
builder.Services.AddHttpClient("OpenAI", client =>
{
    client.Timeout = TimeSpan.FromSeconds(45);
});
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddHangfire(config =>
{
    config.UseSimpleAssemblyNameTypeSerializer()
          .UseRecommendedSerializerSettings()
          .UsePostgreSqlStorage(options =>
          {
              options.UseNpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
          });
});

builder.Services.AddHangfireServer();

// 6. Cấu hình Swagger kèm nút Authorize chuẩn
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "CulinaryBlog.API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Ví dụ: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

static string GetWebFilePath(IWebHostEnvironment env, string fileName)
{
    var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
    return Path.Combine(webRoot, fileName);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSerilogRequestLogging(options =>
{
    options.IncludeQueryInRequestPath = false;
    options.EnrichDiagnosticContext = (context, exception) =>
    {
        context.Set("RequestId", Activity.Current?.TraceId.ToString() ?? "");
        context.Set("ExceptionType", exception?.GetType().Name);
    };
});
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Request-Id"] = context.TraceIdentifier;
    await next(context);
});
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseHangfireDashboard();

// 7. Kích hoạt CORS Middleware
app.UseCors("FrontendPolicy");

// 8. Thêm Authentication & Authorization Middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => Results.Redirect("/login"));
app.MapGet("/login", () => Results.File(GetWebFilePath(app.Environment, "login.html"), "text/html"));
app.MapGet("/register", () => Results.File(GetWebFilePath(app.Environment, "register.html"), "text/html"));
app.MapGet("/home", () => Results.File(GetWebFilePath(app.Environment, "home.html"), "text/html"));
app.MapGet("/categories", () => Results.File(GetWebFilePath(app.Environment, "categories.html"), "text/html"));
app.MapGet("/recipes", () => Results.File(GetWebFilePath(app.Environment, "recipes.html"), "text/html"));

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new
        {
            status = report.Status.ToString(),
            checks = report.Entries.ToDictionary(entry => entry.Key, entry => new
            {
                status = entry.Value.Status.ToString(),
                description = entry.Value.Description,
                data = entry.Value.Data
            })
        });
    }
});
app.MapControllers();

// --- ĐOẠN CODE GỌI SEEDER TỰ ĐỘNG ---
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    // Tự động Apply Migration nếu chưa có bảng
    await dbContext.Database.MigrateAsync();

    // Nhồi 20 Category và 100 Recipe vào Database
    await DataSeeder.SeedDataAsync(dbContext);
    var seedAuthor = await dbContext.Users.FirstAsync(user => user.Email == "admin@culinaryblog.com");
    await RecipeCatalogSeeder.SeedDataAsync(dbContext, seedAuthor);
}

app.Run();

static void ConfigureOtlpExporter(OtlpExporterOptions options, string endpoint)
{
    options.Endpoint = new Uri(endpoint);
}  