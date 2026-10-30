using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CulinaryBlog.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20261026133000_AddCommunityAndStudioExtensions")]
public partial class AddCommunityAndStudioExtensions : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // These objects are already created by the preceding migration.
        // Preserve the migration ID, but do not issue duplicate DDL.
        if (migrationBuilder is not null) return;
        migrationBuilder.CreateTable(name: "CategoryRelationships", columns: table => new
        {
            ChildCategoryId = table.Column<Guid>(type: "uuid", nullable: false), ParentCategoryId = table.Column<Guid>(type: "uuid", nullable: false), CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
        }, constraints: table => { table.PrimaryKey("PK_CategoryRelationships", item => item.ChildCategoryId); table.ForeignKey("FK_CategoryRelationships_Categories_ChildCategoryId", item => item.ChildCategoryId, "Categories", "Id", onDelete: ReferentialAction.Cascade); table.ForeignKey("FK_CategoryRelationships_Categories_ParentCategoryId", item => item.ParentCategoryId, "Categories", "Id", onDelete: ReferentialAction.Restrict); });
        migrationBuilder.CreateIndex(name: "IX_CategoryRelationships_ParentCategoryId", table: "CategoryRelationships", column: "ParentCategoryId");

        migrationBuilder.CreateTable(name: "PostReactions", columns: table => new
        {
            PostId = table.Column<Guid>(type: "uuid", nullable: false), UserId = table.Column<string>(type: "character varying(450)", nullable: false), Type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false), UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
        }, constraints: table => { table.PrimaryKey("PK_PostReactions", item => new { item.PostId, item.UserId }); table.ForeignKey("FK_PostReactions_CommunityPosts_PostId", item => item.PostId, "CommunityPosts", "Id", onDelete: ReferentialAction.Cascade); table.ForeignKey("FK_PostReactions_Users_UserId", item => item.UserId, "Users", "Id", onDelete: ReferentialAction.Cascade); });
        migrationBuilder.CreateIndex(name: "IX_PostReactions_UserId", table: "PostReactions", column: "UserId");

        migrationBuilder.CreateTable(name: "CookingEvents", columns: table => new
        {
            Id = table.Column<Guid>(type: "uuid", nullable: false), Title = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false), Description = table.Column<string>(type: "character varying(3000)", maxLength: 3000, nullable: false), CoverImageUrl = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: true), StartsAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false), EndsAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false), Capacity = table.Column<int>(type: "integer", nullable: true), CreatedById = table.Column<string>(type: "character varying(450)", maxLength: 450, nullable: false), CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
        }, constraints: table => { table.PrimaryKey("PK_CookingEvents", item => item.Id); table.ForeignKey("FK_CookingEvents_Users_CreatedById", item => item.CreatedById, "Users", "Id", onDelete: ReferentialAction.Restrict); });
        migrationBuilder.CreateIndex(name: "IX_CookingEvents_CreatedById", table: "CookingEvents", column: "CreatedById"); migrationBuilder.CreateIndex(name: "IX_CookingEvents_StartsAt_EndsAt", table: "CookingEvents", columns: new[] { "StartsAt", "EndsAt" });

        migrationBuilder.CreateTable(name: "UserWorkspaceDrafts", columns: table => new
        {
            UserId = table.Column<string>(type: "character varying(450)", nullable: false), DraftKey = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false), ContentJson = table.Column<string>(type: "character varying(30000)", maxLength: 30000, nullable: false), UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
        }, constraints: table => { table.PrimaryKey("PK_UserWorkspaceDrafts", item => new { item.UserId, item.DraftKey }); table.ForeignKey("FK_UserWorkspaceDrafts_Users_UserId", item => item.UserId, "Users", "Id", onDelete: ReferentialAction.Cascade); });

        migrationBuilder.CreateTable(name: "CookingEventRegistrations", columns: table => new
        {
            EventId = table.Column<Guid>(type: "uuid", nullable: false), UserId = table.Column<string>(type: "character varying(450)", nullable: false), SubmittedRecipeId = table.Column<Guid>(type: "uuid", nullable: true), RegisteredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false), SubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
        }, constraints: table => { table.PrimaryKey("PK_CookingEventRegistrations", item => new { item.EventId, item.UserId }); table.ForeignKey("FK_CookingEventRegistrations_CookingEvents_EventId", item => item.EventId, "CookingEvents", "Id", onDelete: ReferentialAction.Cascade); table.ForeignKey("FK_CookingEventRegistrations_Users_UserId", item => item.UserId, "Users", "Id", onDelete: ReferentialAction.Cascade); table.ForeignKey("FK_CookingEventRegistrations_Recipes_SubmittedRecipeId", item => item.SubmittedRecipeId, "Recipes", "Id", onDelete: ReferentialAction.SetNull); });
        migrationBuilder.CreateIndex(name: "IX_CookingEventRegistrations_SubmittedRecipeId", table: "CookingEventRegistrations", column: "SubmittedRecipeId"); migrationBuilder.CreateIndex(name: "IX_CookingEventRegistrations_UserId", table: "CookingEventRegistrations", column: "UserId");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        if (migrationBuilder is not null) return;
        migrationBuilder.DropTable(name: "CategoryRelationships"); migrationBuilder.DropTable(name: "PostReactions"); migrationBuilder.DropTable(name: "CookingEventRegistrations"); migrationBuilder.DropTable(name: "UserWorkspaceDrafts"); migrationBuilder.DropTable(name: "CookingEvents");
    }
}
