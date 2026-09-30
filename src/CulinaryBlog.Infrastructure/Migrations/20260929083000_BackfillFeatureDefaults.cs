using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CulinaryBlog.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20260929083000_BackfillFeatureDefaults")]
public sealed class BackfillFeatureDefaults : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("UPDATE \"Recipes\" SET \"Difficulty\" = 'Trung bình' WHERE \"Difficulty\" IS NULL OR btrim(\"Difficulty\") = '';");
        migrationBuilder.Sql("UPDATE \"CommunityPosts\" SET \"CommentsEnabled\" = TRUE WHERE \"CommentsEnabled\" = FALSE;");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
    }
}