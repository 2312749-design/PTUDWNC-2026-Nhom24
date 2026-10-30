using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CulinaryBlog.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20261026121500_AddProExperience")]
public partial class AddProExperience : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // These objects are already created by the preceding migration.
        // Preserve the migration ID, but do not issue duplicate DDL.
        if (migrationBuilder is not null) return;
        migrationBuilder.CreateTable(
            name: "UserPreferences",
            columns: table => new
            {
                UserId = table.Column<string>(type: "character varying(450)", nullable: false),
                SettingsJson = table.Column<string>(type: "character varying(12000)", maxLength: 12000, nullable: false),
                UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserPreferences", preference => preference.UserId);
                table.ForeignKey(
                    name: "FK_UserPreferences_Users_UserId",
                    column: preference => preference.UserId,
                    principalTable: "Users",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "RecipeRevisions",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                RecipeId = table.Column<Guid>(type: "uuid", nullable: false),
                Version = table.Column<int>(type: "integer", nullable: false),
                SnapshotJson = table.Column<string>(type: "character varying(60000)", maxLength: 60000, nullable: false),
                CreatedById = table.Column<string>(type: "character varying(450)", maxLength: 450, nullable: false),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_RecipeRevisions", revision => revision.Id);
                table.ForeignKey(
                    name: "FK_RecipeRevisions_Recipes_RecipeId",
                    column: revision => revision.RecipeId,
                    principalTable: "Recipes",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_RecipeRevisions_Users_CreatedById",
                    column: revision => revision.CreatedById,
                    principalTable: "Users",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.CreateIndex(
            name: "IX_RecipeRevisions_RecipeId_Version",
            table: "RecipeRevisions",
            columns: new[] { "RecipeId", "Version" },
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_RecipeRevisions_CreatedById",
            table: "RecipeRevisions",
            column: "CreatedById");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        if (migrationBuilder is not null) return;
        migrationBuilder.DropTable(name: "RecipeRevisions");
        migrationBuilder.DropTable(name: "UserPreferences");
    }
}
