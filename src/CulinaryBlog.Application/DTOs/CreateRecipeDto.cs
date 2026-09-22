using System;
using System.Collections.Generic;
using System.Text;

namespace CulinaryBlog.Application.DTOs;

public class CreateRecipeDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<string> Ingredients { get; set; } = new();
    public List<string> Instructions { get; set; } = new();
    public Guid CategoryId { get; set; }
}
