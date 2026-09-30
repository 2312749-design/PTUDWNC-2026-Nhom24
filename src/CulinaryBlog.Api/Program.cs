using CulinaryBlog.Api.Middleware;
using CulinaryBlog.Application.Abstractions;
using CulinaryBlog.Application.Abstractions.Repositories;
using CulinaryBlog.Infrastructure.Persistence;
using CulinaryBlog.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using CulinaryBlog.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IRecipeRepository, RecipeRepository>();
builder.Services.AddScoped<IRecipeIngredientRepository, RecipeIngredientRepository>();
builder.Services.AddScoped<IRecipeStepRepository, RecipeStepRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

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

app.UseMiddleware<GlobalExceptionHandlingMiddleware>();
app.UseCors("Frontend");

app.MapRecipeEndpoints();

app.MapGet("/", () => "Hello World!");

app.Run();