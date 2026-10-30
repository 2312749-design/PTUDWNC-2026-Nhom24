using System;
using System.Collections.Generic;
using System.Text;

namespace CulinaryBlog.Application.DTOs;

public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    /// <summary>Total active recipes assigned to this category.</summary>
    public int RecipeCount { get; set; }
    /// <summary>Recipes visitors can open without administrator privileges.</summary>
    public int PublishedRecipeCount { get; set; }
}
