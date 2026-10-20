using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace CulinaryBlog.Application.DTOs;

public class CreateCategoryDto
{
    [Required, StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;
    [Url, StringLength(2048)]
    public string? ImageUrl { get; set; }
}
