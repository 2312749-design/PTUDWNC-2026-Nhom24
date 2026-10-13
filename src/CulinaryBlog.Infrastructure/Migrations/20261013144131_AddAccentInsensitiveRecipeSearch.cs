using Microsoft.EntityFrameworkCore.Migrations;
using NpgsqlTypes;

#nullable disable

namespace CulinaryBlog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAccentInsensitiveRecipeSearch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                CREATE EXTENSION IF NOT EXISTS unaccent;

                CREATE OR REPLACE FUNCTION public.immutable_unaccent(text)
                RETURNS text
                LANGUAGE sql
                IMMUTABLE
                PARALLEL SAFE
                STRICT
                AS $function$
                    SELECT unaccent('unaccent', $1)
                $function$;
                """);

            migrationBuilder.AlterColumn<NpgsqlTsVector>(
                name: "SearchVector",
                table: "Recipes",
                type: "tsvector",
                nullable: true,
                computedColumnSql: "to_tsvector('simple'::regconfig, public.immutable_unaccent(coalesce(\"Title\", '') || ' ' || coalesce(\"Description\", '')))",
                stored: true,
                oldClrType: typeof(NpgsqlTsVector),
                oldType: "tsvector",
                oldNullable: true,
                oldComputedColumnSql: "to_tsvector('simple'::regconfig, coalesce(\"Title\", '') || ' ' || coalesce(\"Description\", ''))",
                oldStored: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<NpgsqlTsVector>(
                name: "SearchVector",
                table: "Recipes",
                type: "tsvector",
                nullable: true,
                computedColumnSql: "to_tsvector('simple'::regconfig, coalesce(\"Title\", '') || ' ' || coalesce(\"Description\", ''))",
                stored: true,
                oldClrType: typeof(NpgsqlTsVector),
                oldType: "tsvector",
                oldNullable: true,
                oldComputedColumnSql: "to_tsvector('simple'::regconfig, public.immutable_unaccent(coalesce(\"Title\", '') || ' ' || coalesce(\"Description\", '')))",
                oldStored: true);

            migrationBuilder.Sql(
                """DROP FUNCTION IF EXISTS public.immutable_unaccent(text);""");
        }
    }
}
