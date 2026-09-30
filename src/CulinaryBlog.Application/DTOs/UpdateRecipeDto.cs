using System;
using System.Collections.Generic;
using System.Text;

namespace CulinaryBlog.Application.DTOs;

public class UpdateRecipeDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public List<string> Ingredients { get; set; } = new();
    public List<string> Instructions { get; set; } = new();
    public Guid CategoryId { get; set; }
    public int Status { get; set; } // 0: Draft, 1: Published
    public int? CookingTimeMinutes { get; set; }
    public string Difficulty { get; set; } = "Trung bình";
    public bool IsVegetarian { get; set; }
}
