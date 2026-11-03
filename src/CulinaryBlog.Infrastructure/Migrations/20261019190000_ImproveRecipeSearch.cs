using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CulinaryBlog.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20261019190000_ImproveRecipeSearch")]
public partial class ImproveRecipeSearch : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("CREATE EXTENSION IF NOT EXISTS unaccent;");
        migrationBuilder.Sql("CREATE EXTENSION IF NOT EXISTS pg_trgm;");
        migrationBuilder.Sql("DROP TRIGGER IF EXISTS update_recipe_search_vector ON \"Recipes\";");
        migrationBuilder.Sql("""
            CREATE OR REPLACE FUNCTION update_recipe_search_vector() RETURNS trigger AS $$
            BEGIN
                NEW."SearchVector" := to_tsvector(
                    'simple'::regconfig,
                    unaccent(coalesce(NEW."Title", '')) || ' ' ||
                    unaccent(coalesce(NEW."Description", '')) || ' ' ||
                    unaccent(coalesce(array_to_string(NEW."Ingredients", ' '), ''))
                );
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER update_recipe_search_vector
            BEFORE INSERT OR UPDATE OF "Title", "Description", "Ingredients"
            ON "Recipes"
            FOR EACH ROW EXECUTE FUNCTION update_recipe_search_vector();

            CREATE INDEX IF NOT EXISTS "IX_Recipes_Title_Trgm"
            ON "Recipes" USING GIN (LOWER("Title") gin_trgm_ops);

            UPDATE "Recipes" SET "Title" = "Title";
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_Recipes_Title_Trgm\";");
        migrationBuilder.Sql("DROP TRIGGER IF EXISTS update_recipe_search_vector ON \"Recipes\";");
        migrationBuilder.Sql("""
            CREATE OR REPLACE FUNCTION update_recipe_search_vector() RETURNS trigger AS $$
            BEGIN
                NEW."SearchVector" := to_tsvector(
                    'simple'::regconfig,
                    coalesce(NEW."Title", '') || ' ' ||
                    coalesce(NEW."Description", '') || ' ' ||
                    coalesce(array_to_string(NEW."Ingredients", ' '), '')
                );
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER update_recipe_search_vector
            BEFORE INSERT OR UPDATE OF "Title", "Description", "Ingredients"
            ON "Recipes"
            FOR EACH ROW EXECUTE FUNCTION update_recipe_search_vector();

            UPDATE "Recipes" SET "Title" = "Title";
            """);
    }
}
