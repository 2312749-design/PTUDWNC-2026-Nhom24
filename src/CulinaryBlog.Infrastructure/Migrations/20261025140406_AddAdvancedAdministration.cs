using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CulinaryBlog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAdvancedAdministration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsSuspended",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "SuspendedUntil",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SuspensionReason",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReviewNote",
                table: "Recipes",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReviewRequestedAt",
                table: "Recipes",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReviewStatus",
                table: "Recipes",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "Draft");

            migrationBuilder.AddColumn<DateTime>(
                name: "ReviewedAt",
                table: "Recipes",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReviewedById",
                table: "Recipes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResolutionAction",
                table: "ContentReports",
                type: "character varying(80)",
                maxLength: 80,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResolutionNote",
                table: "ContentReports",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResolvedById",
                table: "ContentReports",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "HiddenAt",
                table: "CommunityPosts",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HiddenReason",
                table: "CommunityPosts",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsHidden",
                table: "CommunityPosts",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                table: "Categories",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsVisible",
                table: "Categories",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.CreateTable(
                name: "AdminAuditLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ActorId = table.Column<string>(type: "text", nullable: false),
                    Action = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    TargetType = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    TargetId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Summary = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminAuditLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AdminAuditLogs_Users_ActorId",
                        column: x => x.ActorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContentReports_ResolvedById",
                table: "ContentReports",
                column: "ResolvedById");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_IsDeleted_IsVisible_DisplayOrder",
                table: "Categories",
                columns: new[] { "IsDeleted", "IsVisible", "DisplayOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_AdminAuditLogs_ActorId",
                table: "AdminAuditLogs",
                column: "ActorId");

            migrationBuilder.CreateIndex(
                name: "IX_AdminAuditLogs_CreatedAt_TargetType_TargetId",
                table: "AdminAuditLogs",
                columns: new[] { "CreatedAt", "TargetType", "TargetId" });

            migrationBuilder.AddForeignKey(
                name: "FK_ContentReports_Users_ResolvedById",
                table: "ContentReports",
                column: "ResolvedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContentReports_Users_ResolvedById",
                table: "ContentReports");

            migrationBuilder.DropTable(
                name: "AdminAuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_ContentReports_ResolvedById",
                table: "ContentReports");

            migrationBuilder.DropIndex(
                name: "IX_Categories_IsDeleted_IsVisible_DisplayOrder",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "IsSuspended",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SuspendedUntil",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SuspensionReason",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ReviewNote",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "ReviewRequestedAt",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "ReviewStatus",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "ReviewedAt",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "ReviewedById",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "ResolutionAction",
                table: "ContentReports");

            migrationBuilder.DropColumn(
                name: "ResolutionNote",
                table: "ContentReports");

            migrationBuilder.DropColumn(
                name: "ResolvedById",
                table: "ContentReports");

            migrationBuilder.DropColumn(
                name: "HiddenAt",
                table: "CommunityPosts");

            migrationBuilder.DropColumn(
                name: "HiddenReason",
                table: "CommunityPosts");

            migrationBuilder.DropColumn(
                name: "IsHidden",
                table: "CommunityPosts");

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "IsVisible",
                table: "Categories");
        }
    }
}
