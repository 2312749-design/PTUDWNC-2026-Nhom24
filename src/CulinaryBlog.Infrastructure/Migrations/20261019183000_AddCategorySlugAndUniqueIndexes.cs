using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CulinaryBlog.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20261019183000_AddCategorySlugAndUniqueIndexes")]
public partial class AddCategorySlugAndUniqueIndexes : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "Slug",
            table: "Categories",
            type: "character varying(160)",
            maxLength: 160,
            nullable: true);

        migrationBuilder.Sql("""
            WITH base AS (
                SELECT "Id", LEFT(LOWER(REGEXP_REPLACE(COALESCE(NULLIF(BTRIM("Name"), ''), 'category'), '\\s+', '-', 'g')), 145) AS base_slug
                FROM "Categories"
            )
            UPDATE "Categories" AS category
            SET "Slug" = base.base_slug || '-' || LEFT(REPLACE(category."Id"::text, '-', ''), 12)
            FROM base
            WHERE category."Id" = base."Id";
            """);

        migrationBuilder.AlterColumn<string>(
            name: "Slug",
            table: "Categories",
            type: "character varying(160)",
            maxLength: 160,
            nullable: false,
            oldClrType: typeof(string),
            oldType: "character varying(160)",
            oldMaxLength: 160,
            oldNullable: true);

        migrationBuilder.AlterColumn<string>(
            name: "Name",
            table: "Categories",
            type: "character varying(100)",
            maxLength: 100,
            nullable: false,
            oldClrType: typeof(string),
            oldType: "text");

        migrationBuilder.CreateIndex(
            name: "IX_Categories_Name",
            table: "Categories",
            column: "Name",
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_Categories_Slug",
            table: "Categories",
            column: "Slug",
            unique: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(name: "IX_Categories_Name", table: "Categories");
        migrationBuilder.DropIndex(name: "IX_Categories_Slug", table: "Categories");

        migrationBuilder.DropColumn(name: "Slug", table: "Categories");

        migrationBuilder.AlterColumn<string>(
            name: "Name",
            table: "Categories",
            type: "text",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "character varying(100)",
            oldMaxLength: 100);
    }
}
