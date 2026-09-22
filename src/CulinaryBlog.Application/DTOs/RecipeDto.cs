using System;
using System.Collections.Generic;
using System.Text;

namespace CulinaryBlog.Application.DTOs;

public class RecipeDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<string> Ingredients { get; set; } = new();
    public List<string> Instructions { get; set; } = new();
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string AuthorId { get; set; } = string.Empty;
    public int Status { get; set; }
}
