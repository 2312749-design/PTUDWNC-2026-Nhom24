using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CulinaryBlog.Infrastructure.Migrations;

[DbContext(typeof(ApplicationDbContext))]
[Migration("20260930102800_AddRecipeSearchVector")]
public partial class AddRecipeSearchVector : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            """
            DO $migration$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_schema = current_schema()
                      AND table_name = 'Recipes'
                      AND column_name = 'SearchVector'
                ) THEN
                    ALTER TABLE "Recipes"
                    ADD COLUMN "SearchVector" tsvector
                    GENERATED ALWAYS AS (
                        to_tsvector(
                            'simple'::regconfig,
                            coalesce("Title", '') || ' ' || coalesce("Description", '')
                        )
                    ) STORED;
                END IF;
            END
            $migration$;

            CREATE INDEX IF NOT EXISTS "IX_Recipes_SearchVector"
            ON "Recipes" USING GIN ("SearchVector");
            """);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(
            """DROP INDEX IF EXISTS "IX_Recipes_SearchVector";""");
    }
}
