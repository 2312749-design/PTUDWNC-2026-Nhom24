using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CulinaryBlog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixChallengeSubmissionRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChallengeSubmissions_CookingChallenges_CookingChallengeId",
                table: "ChallengeSubmissions");

            migrationBuilder.DropIndex(
                name: "IX_ChallengeSubmissions_CookingChallengeId",
                table: "ChallengeSubmissions");

            migrationBuilder.DropColumn(
                name: "CookingChallengeId",
                table: "ChallengeSubmissions");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CookingChallengeId",
                table: "ChallengeSubmissions",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChallengeSubmissions_CookingChallengeId",
                table: "ChallengeSubmissions",
                column: "CookingChallengeId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChallengeSubmissions_CookingChallenges_CookingChallengeId",
                table: "ChallengeSubmissions",
                column: "CookingChallengeId",
                principalTable: "CookingChallenges",
                principalColumn: "Id");
        }
    }
}
