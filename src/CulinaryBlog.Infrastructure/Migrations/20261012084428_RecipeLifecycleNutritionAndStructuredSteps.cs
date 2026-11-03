using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CulinaryBlog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RecipeLifecycleNutritionAndStructuredSteps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RecipeSteps_RecipeId",
                table: "RecipeSteps");

            migrationBuilder.DropIndex(
                name: "IX_RecipeIngredients_RecipeId",
                table: "RecipeIngredients");

            migrationBuilder.RenameColumn(
                name: "Order",
                table: "RecipeSteps",
                newName: "StepNumber");

            migrationBuilder.RenameColumn(
                name: "Order",
                table: "RecipeIngredients",
                newName: "OrderIndex");

            migrationBuilder.Sql("DROP TRIGGER IF EXISTS update_recipe_search_vector ON \"Recipes\";");

            migrationBuilder.Sql("UPDATE \"Recipes\" SET \"Title\" = LEFT(COALESCE(NULLIF(BTRIM(\"Title\"), ''), 'Untitled recipe'), 160);");
            migrationBuilder.Sql("UPDATE \"Recipes\" SET \"Slug\" = LEFT(COALESCE(NULLIF(BTRIM(\"Slug\"), ''), 'recipe'), 200);");
            migrationBuilder.Sql("UPDATE \"Recipes\" SET \"Difficulty\" = CASE LOWER(BTRIM(\"Difficulty\")) WHEN 'dễ' THEN 'Easy' WHEN 'easy' THEN 'Easy' WHEN 'trung bình' THEN 'Medium' WHEN 'medium' THEN 'Medium' WHEN 'khó' THEN 'Hard' WHEN 'hard' THEN 'Hard' WHEN 'expert' THEN 'Expert' ELSE 'Medium' END;");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "RecipeSteps",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "RecipeSteps",
                type: "character varying(2048)",
                maxLength: 2048,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TimerMinutes",
                table: "RecipeSteps",
                type: "integer",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Recipes",
                type: "character varying(160)",
                maxLength: 160,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "Recipes",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Difficulty",
                table: "Recipes",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int>(
                name: "CookTimeMinutes",
                table: "Recipes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "Nutrition_Calories",
                table: "Recipes",
                type: "numeric(12,2)",
                precision: 12,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Nutrition_Carbohydrates",
                table: "Recipes",
                type: "numeric(12,2)",
                precision: 12,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Nutrition_Fat",
                table: "Recipes",
                type: "numeric(12,2)",
                precision: 12,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Nutrition_Fiber",
                table: "Recipes",
                type: "numeric(12,2)",
                precision: 12,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Nutrition_Protein",
                table: "Recipes",
                type: "numeric(12,2)",
                precision: 12,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Nutrition_Sodium",
                table: "Recipes",
                type: "numeric(12,2)",
                precision: 12,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PrepTimeMinutes",
                table: "Recipes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Servings",
                table: "Recipes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "RecipeIngredients",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.Sql("UPDATE \"Recipes\" SET \"PrepTimeMinutes\" = 1, \"CookTimeMinutes\" = GREATEST(COALESCE(\"CookingTimeMinutes\", 1) - 1, 0), \"Servings\" = 1;");
            migrationBuilder.Sql("WITH ranked AS (SELECT \"Id\", \"Slug\", ROW_NUMBER() OVER (PARTITION BY \"Slug\" ORDER BY \"Id\") AS duplicate_number FROM \"Recipes\") UPDATE \"Recipes\" AS recipe SET \"Slug\" = LEFT(ranked.\"Slug\", 180) || '-' || LEFT(REPLACE(ranked.\"Id\"::text, '-', ''), 12) FROM ranked WHERE recipe.\"Id\" = ranked.\"Id\" AND ranked.duplicate_number > 1;");
            migrationBuilder.Sql("WITH ranked AS (SELECT \"Id\", ROW_NUMBER() OVER (PARTITION BY \"RecipeId\" ORDER BY \"OrderIndex\", \"Id\") AS order_number FROM \"RecipeIngredients\") UPDATE \"RecipeIngredients\" AS item SET \"OrderIndex\" = ranked.order_number FROM ranked WHERE item.\"Id\" = ranked.\"Id\";");
            migrationBuilder.Sql("WITH ranked AS (SELECT \"Id\", ROW_NUMBER() OVER (PARTITION BY \"RecipeId\" ORDER BY \"StepNumber\", \"Id\") AS step_number FROM \"RecipeSteps\") UPDATE \"RecipeSteps\" AS item SET \"StepNumber\" = ranked.step_number FROM ranked WHERE item.\"Id\" = ranked.\"Id\";");
            migrationBuilder.Sql("CREATE TRIGGER update_recipe_search_vector BEFORE INSERT OR UPDATE OF \"Title\", \"Description\", \"Ingredients\" ON \"Recipes\" FOR EACH ROW EXECUTE FUNCTION update_recipe_search_vector(); UPDATE \"Recipes\" SET \"Title\" = \"Title\";");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeSteps_RecipeId_StepNumber",
                table: "RecipeSteps",
                columns: new[] { "RecipeId", "StepNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_Slug",
                table: "Recipes",
                column: "Slug",
                unique: true);

            migrationBuilder.AddCheckConstraint(
                name: "CK_Recipes_CookTimeMinutes",
                table: "Recipes",
                sql: "\"CookTimeMinutes\" >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Recipes_Difficulty",
                table: "Recipes",
                sql: "\"Difficulty\" IN ('Easy', 'Medium', 'Hard', 'Expert')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Recipes_Nutrition",
                table: "Recipes",
                sql: "(\"Nutrition_Calories\" IS NULL OR \"Nutrition_Calories\" >= 0) AND (\"Nutrition_Protein\" IS NULL OR \"Nutrition_Protein\" >= 0) AND (\"Nutrition_Carbohydrates\" IS NULL OR \"Nutrition_Carbohydrates\" >= 0) AND (\"Nutrition_Fat\" IS NULL OR \"Nutrition_Fat\" >= 0) AND (\"Nutrition_Fiber\" IS NULL OR \"Nutrition_Fiber\" >= 0) AND (\"Nutrition_Sodium\" IS NULL OR \"Nutrition_Sodium\" >= 0)");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Recipes_PrepTimeMinutes",
                table: "Recipes",
                sql: "\"PrepTimeMinutes\" > 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Recipes_Servings",
                table: "Recipes",
                sql: "\"Servings\" > 0");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredients_RecipeId_OrderIndex",
                table: "RecipeIngredients",
                columns: new[] { "RecipeId", "OrderIndex" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RecipeSteps_RecipeId_StepNumber",
                table: "RecipeSteps");

            migrationBuilder.DropIndex(
                name: "IX_Recipes_Slug",
                table: "Recipes");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Recipes_CookTimeMinutes",
                table: "Recipes");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Recipes_Difficulty",
                table: "Recipes");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Recipes_Nutrition",
                table: "Recipes");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Recipes_PrepTimeMinutes",
                table: "Recipes");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Recipes_Servings",
                table: "Recipes");

            migrationBuilder.DropIndex(
                name: "IX_RecipeIngredients_RecipeId_OrderIndex",
                table: "RecipeIngredients");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "RecipeSteps");

            migrationBuilder.DropColumn(
                name: "TimerMinutes",
                table: "RecipeSteps");

            migrationBuilder.DropColumn(
                name: "CookTimeMinutes",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Nutrition_Calories",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Nutrition_Carbohydrates",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Nutrition_Fat",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Nutrition_Fiber",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Nutrition_Protein",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Nutrition_Sodium",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "PrepTimeMinutes",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Servings",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "RecipeIngredients");

            migrationBuilder.RenameColumn(
                name: "StepNumber",
                table: "RecipeSteps",
                newName: "Order");

            migrationBuilder.RenameColumn(
                name: "OrderIndex",
                table: "RecipeIngredients",
                newName: "Order");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "RecipeSteps",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Recipes",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(160)",
                oldMaxLength: 160);

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "Recipes",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Difficulty",
                table: "Recipes",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(10)",
                oldMaxLength: 10);

            migrationBuilder.CreateIndex(
                name: "IX_RecipeSteps_RecipeId",
                table: "RecipeSteps",
                column: "RecipeId");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredients_RecipeId",
                table: "RecipeIngredients",
                column: "RecipeId");
        }
    }
}
