using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CulinaryBlog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRecipeIngredientAndInstruction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE \"Recipes\" ALTER COLUMN \"Instructions\" DROP DEFAULT;");
            migrationBuilder.Sql("ALTER TABLE \"Recipes\" ALTER COLUMN \"Instructions\" TYPE text[] USING \"Instructions\"::text[];");

            migrationBuilder.AddColumn<string[]>(
                name: "Ingredients",
                table: "Recipes",
                type: "text[]",
                nullable: false,
                defaultValue: new string[] { });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ingredients",
                table: "Recipes");

            migrationBuilder.Sql("ALTER TABLE \"Recipes\" ALTER COLUMN \"Instructions\" DROP DEFAULT;");
            migrationBuilder.AlterColumn<string>(
                name: "Instructions",
                table: "Recipes",
                type: "text",
                nullable: false,
                oldClrType: typeof(List<string>),
                oldType: "text[]");
        }
    }
}
