using System.Text.Json;

namespace CulinaryBlog.Application.DTOs;

public sealed class PatchRecipeDto
{
    public JsonElement Nutrition { get; set; }
}