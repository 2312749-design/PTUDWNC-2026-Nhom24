using Asp.Versioning;
using CulinaryBlog.API.Configuration;
using CulinaryBlog.API.Middleware;
using CulinaryBlog.API.Endpoints;
using CulinaryBlog.API.Health;
using CulinaryBlog.API.Services;
using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Application.Models;
using CulinaryBlog.Infrastructure.Persistence;
using CulinaryBlog.Infrastructure.Jobs;
using CulinaryBlog.Infrastructure.Services;
using Hangfire;
using Hangfire.PostgreSql;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
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
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);
var serviceName = builder.Configuration["OpenTelemetry:ServiceName"] ?? "culinary-blog-api";
var databaseInitialization = builder.Configuration
    .GetSection("DatabaseInitialization")
    .Get<DatabaseInitializationOptions>()
    ?? new DatabaseInitializationOptions();

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
}, ["ready"]);
healthChecks.AddCheck("redis", () =>
{
    if (redisConnection is null)
    {
        return HealthCheckResult.Healthy("Redis cache is disabled.");
    }

    return redisConnection.IsConnected
        ? HealthCheckResult.Healthy("Redis is reachable.")
        : HealthCheckResult.Unhealthy("Redis is unavailable.");
}, ["ready"]);
healthChecks.AddCheck<MinioReadinessHealthCheck>("minio", tags: ["ready"]);

builder.Services.AddApiSecurity(builder.Configuration);

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
var otlpHeaders = builder.Configuration["OpenTelemetry:Headers"];
if (!string.IsNullOrWhiteSpace(otlpEndpoint))
{
    openTelemetry.WithTracing(tracing => tracing.AddOtlpExporter(options =>
        ConfigureOtlpExporter(options, otlpEndpoint, otlpHeaders)));
    openTelemetry.WithMetrics(metrics => metrics.AddOtlpExporter(options =>
        ConfigureOtlpExporter(options, otlpEndpoint, otlpHeaders)));
}

// 2. Bind JwtSettings từ appsettings.json
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

// 3. Đăng ký TokenService vào DI Container
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.Configure<SmtpEmailOptions>(builder.Configuration.GetSection("Email"));
builder.Services.AddScoped<IEmailSender, SmtpEmailSender>();
builder.Services.AddScoped<StorageMaintenanceJob>();
var dataProtection = builder.Services.AddDataProtection().SetApplicationName("CulinaryBlog");
var dataProtectionKeysPath = builder.Configuration["DataProtection:KeysPath"];
if (!string.IsNullOrWhiteSpace(dataProtectionKeysPath))
{
    Directory.CreateDirectory(dataProtectionKeysPath);
    dataProtection.PersistKeysToFileSystem(new DirectoryInfo(dataProtectionKeysPath));
}
builder.Services.AddScoped<AccountSecurityService>();

// 4. Cấu hình Authentication & JWT Bearer
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
if (string.IsNullOrWhiteSpace(jwtSettings?.Secret) || jwtSettings.Secret.Length < 32)
    throw new InvalidOperationException("JwtSettings:Secret must be supplied through user secrets or the JwtSettings__Secret environment variable and contain at least 32 characters.");
if (string.IsNullOrWhiteSpace(jwtSettings.Issuer) || string.IsNullOrWhiteSpace(jwtSettings.Audience))
    throw new InvalidOperationException("JwtSettings:Issuer and JwtSettings:Audience must be configured.");
var key = Encoding.UTF8.GetBytes(jwtSettings.Secret);
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
        ValidateIssuer = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtSettings.Audience,
        ClockSkew = TimeSpan.Zero
    };
    // Bearer remains supported for existing clients. Browser sessions can
    // also use the HttpOnly access cookie, which is not readable by page JS.
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (string.IsNullOrWhiteSpace(context.Token)
                && context.Request.Cookies.TryGetValue(AuthHandlers.AccessTokenCookieName, out var cookieToken))
            {
                context.Token = cookieToken;
            }
            return Task.CompletedTask;
        }
    };
});

// 5. Cấu hình CORS cho Frontend React chạy ở localhost:3000
// Đăng ký MediatR tự động quét các Handler trong tầng Application
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CulinaryBlog.Application.DTOs.CategoryDto).Assembly));

builder.Services.AddApplicationHandlers();
builder.Services.AddScoped<IGoogleIdentityVerifier, GoogleIdentityVerifier>();
builder.Services.Configure<RouteHandlerOptions>(options => options.ThrowOnBadRequest = true);
builder.Services.AddAuthorization();
var trustForwardedHeaders = builder.Configuration.GetValue<bool>("ReverseProxy:TrustForwardedHeaders");
if (trustForwardedHeaders)
{
    builder.Services.Configure<ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
        // Docker's private bridge range covers the internal Nginx container.
        // Keep the framework defaults too, so a public client cannot forge
        // forwarded headers when it reaches the API port directly.
        options.KnownIPNetworks.Add(new System.Net.IPNetwork(IPAddress.Parse("172.16.0.0"), 12));
        options.ForwardLimit = 1;
    });
}

builder.Services.AddHttpClient("OpenAI", client =>
{
    client.Timeout = TimeSpan.FromSeconds(45);
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    options.ApiVersionReader = new UrlSegmentApiVersionReader();
})
.AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});

builder.Services.AddHangfire(config =>
{
    config.UseSimpleAssemblyNameTypeSerializer()
          .UseRecommendedSerializerSettings()
          .UsePostgreSqlStorage(options =>
          {
              options.UseNpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
          });
});
GlobalJobFilters.Filters.Add(new AutomaticRetryAttribute { Attempts = 3 });
builder.Services.AddHangfireServer();

// 6. Cấu hình Swagger kèm nút Authorize chuẩn
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "CulinaryBlog API",
        Version = "v1",
        Description = "CulinaryBlog API documentation for version 1.0",
        Contact = new OpenApiContact { Name = "CulinaryBlog Team" }
    });

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

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "V1");
});

static string GetWebFilePath(IWebHostEnvironment env, string fileName)
{
    var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
    return Path.Combine(webRoot, fileName);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Swagger UI is enabled globally so API version metadata remains visible across environments.
}

app.UseMiddleware<CorrelationIdMiddleware>();
app.UseSerilogRequestLogging(options =>
{
    options.IncludeQueryInRequestPath = false;
    options.EnrichDiagnosticContext = (context, exception) =>
    {
        context.Set("RequestId", Activity.Current?.TraceId.ToString() ?? "");
        context.Set("ExceptionType", exception?.GetType().Name);
    };
});
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseStatusCodePages(async (StatusCodeContext statusContext) =>
{
    var response = statusContext.HttpContext.Response;
    var statusCode = response.StatusCode;
    response.ContentType = "application/problem+json";
    var problem = new ProblemDetails
    {
        Status = statusCode,
        Title = Microsoft.AspNetCore.WebUtilities.ReasonPhrases.GetReasonPhrase(statusCode),
        Detail = Microsoft.AspNetCore.WebUtilities.ReasonPhrases.GetReasonPhrase(statusCode)
    };
    await response.WriteAsync(JsonSerializer.Serialize(problem, new JsonSerializerOptions(JsonSerializerDefaults.Web)));
});
if (!app.Environment.IsDevelopment())
    app.UseHsts();
if (trustForwardedHeaders)
    app.UseForwardedHeaders();
app.UseHttpsRedirection();
app.UseStaticFiles();

// 7. Kích hoạt CORS Middleware
app.UseCors("FrontendPolicy");

// 7.1. Kích hoạt Rate Limiting Middleware để ràng buộc request thực sự
app.UseRateLimiter();

// 8. Thêm Authentication & Authorization Middleware
app.UseAuthentication();
app.UseAuthorization();
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = [new HangfireDashboardAuthorizationFilter()]
});

app.MapGet("/", () => Results.Redirect("/login"));
app.MapGet("/login", () => Results.File(GetWebFilePath(app.Environment, "login.html"), "text/html"));
app.MapGet("/register", () => Results.File(GetWebFilePath(app.Environment, "register.html"), "text/html"));
app.MapGet("/home", () => Results.File(GetWebFilePath(app.Environment, "home.html"), "text/html"));
app.MapGet("/categories", () => Results.File(GetWebFilePath(app.Environment, "categories.html"), "text/html"));
app.MapGet("/recipes", () => Results.File(GetWebFilePath(app.Environment, "recipes.html"), "text/html"));

static Task WriteHealthResponse(HttpContext context, HealthReport report) => WriteHealthResponseAsync(context, report);
static async Task WriteHealthResponseAsync(HttpContext context, HealthReport report)
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
app.MapHealthChecks("/health", new HealthCheckOptions { ResponseWriter = WriteHealthResponse });
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = registration => registration.Tags.Contains("live"),
    ResponseWriter = WriteHealthResponse
});
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = registration => registration.Tags.Contains("ready"),
    ResponseWriter = WriteHealthResponse
});
var apiVersionSet = app.NewApiVersionSet("CulinaryBlog API")
    .HasApiVersion(new ApiVersion(1, 0))
    .ReportApiVersions()
    .Build();

// All API endpoints belong to one formal v1 contract. Existing /api/v1 URLs
// remain stable for the frontend while endpoint metadata and version headers
// are supplied by Asp.Versioning.
var apiV1 = app.MapGroup(string.Empty)
    .WithApiVersionSet(apiVersionSet)
    .MapToApiVersion(1, 0);
apiV1.MapApplicationEndpoints();

// Local and Docker demos initialize themselves by default. Production can
// disable either operation after running its deployment migration/seed step.
if (databaseInitialization.ApplyMigrationsOnStartup || databaseInitialization.SeedDemoDataOnStartup)
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    if (databaseInitialization.ApplyMigrationsOnStartup)
    {
        await dbContext.Database.MigrateAsync();
    }

    if (databaseInitialization.SeedDemoDataOnStartup)
    {
        await DataSeeder.SeedDataAsync(dbContext);
        var seedAuthor = await dbContext.Users.FirstAsync(user =>
            user.Email == "admin@culinaryblog.com" || user.UserName == "chefdemo");
        await RecipeCatalogSeeder.SeedDataAsync(dbContext, seedAuthor);
        await DemoActivitySeeder.SeedAsync(dbContext, seedAuthor);
        await ExpandedDemoDataSeeder.SeedAsync(dbContext, seedAuthor);
    }
}

RecurringJob.AddOrUpdate<SitemapGenerationJob>("sitemap-generation", job => job.GenerateAsync(), Cron.Daily);
RecurringJob.AddOrUpdate<StorageMaintenanceJob>("storage-maintenance", job => job.InspectAsync(), Cron.Weekly);

app.Run();

static void ConfigureOtlpExporter(OtlpExporterOptions options, string endpoint, string? headers)
{
    options.Endpoint = new Uri(endpoint);
    if (!string.IsNullOrWhiteSpace(headers))
    {
        options.Headers = headers;
    }
}
