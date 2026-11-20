using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CulinaryBlog.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20261109090000_AddRecipeImageMetadataFields")]
public sealed class AddRecipeImageMetadataFields : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>("AltText", "RecipeImages", "text", nullable: true);
        migrationBuilder.AddColumn<int>("OrderIndex", "RecipeImages", "integer", nullable: false, defaultValue: 0);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn("OrderIndex", "RecipeImages");
        migrationBuilder.DropColumn("AltText", "RecipeImages");
    }
}
