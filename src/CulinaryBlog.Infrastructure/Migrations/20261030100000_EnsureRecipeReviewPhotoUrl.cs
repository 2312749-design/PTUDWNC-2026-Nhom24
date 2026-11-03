using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CulinaryBlog.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20261030100000_EnsureRecipeReviewPhotoUrl")]
public sealed class EnsureRecipeReviewPhotoUrl : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // The preceding model snapshot contains this property, but its Up()
        // never added the column. Existing local databases may already have
        // it, so repair both a clean database and an upgraded one safely.
        migrationBuilder.Sql("""
            ALTER TABLE "RecipeReviews"
            ADD COLUMN IF NOT EXISTS "PhotoUrl" character varying(2048) NULL;
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // Earlier snapshots already declare PhotoUrl. Do not delete review
        // photos when rolling back this compatibility repair.
    }
}
