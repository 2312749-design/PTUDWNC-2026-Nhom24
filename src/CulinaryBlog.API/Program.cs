using CulinaryBlog.Application.Interfaces;
using CulinaryBlog.Application.Models;
using CulinaryBlog.Infrastructure.Persistence;
using CulinaryBlog.Infrastructure.Services;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Cấu hình DbContext kết nối PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký IApplicationDbContext ánh xạ vào ApplicationDbContext (Phục vụ Clean Architecture)
builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

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
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Đăng ký MediatR tự động quét các Handler trong tầng Application
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CulinaryBlog.Application.DTOs.CategoryDto).Assembly));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

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

app.UseHttpsRedirection();
app.UseStaticFiles();

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

app.MapControllers();

// --- ĐOẠN CODE GỌI SEEDER TỰ ĐỘNG ---
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    // Tự động Apply Migration nếu chưa có bảng
    await dbContext.Database.MigrateAsync();

    // Nhồi 20 Category và 100 Recipe vào Database
    await DataSeeder.SeedDataAsync(dbContext);
}

app.Run();  