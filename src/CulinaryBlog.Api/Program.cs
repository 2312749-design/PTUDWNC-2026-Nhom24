using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using CulinaryBlog.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseNpgsql(
builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS cho phép Frontend Next.js gọi API
builder.Services.AddCors(options =>
{
options.AddPolicy("Frontend", policy =>
{
policy
.WithOrigins("http://localhost:3000")
.AllowAnyHeader()
.AllowAnyMethod();
});
});

var app = builder.Build();

// Kích hoạt CORS
app.UseCors("Frontend");

app.MapRecipeEndpoints();

app.MapGet("/", () => "Hello World!");

app.Run();