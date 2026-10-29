\set ON_ERROR_STOP on

-- Run against the isolated submission database after the API has migrated and
-- seeded it. This script reads data only and fails if a Lab 2 minimum is unmet.
BEGIN TRANSACTION READ ONLY;

DO $$
DECLARE
    category_count integer;
    recipe_count integer;
    incomplete_count integer;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM "__EFMigrationsHistory"
        WHERE "MigrationId" = '20261026133000_AddCommunityAndStudioExtensions'
    ) THEN
        RAISE EXCEPTION 'The latest submission migration has not been applied.';
    END IF;

    SELECT COUNT(*) INTO category_count FROM "Categories" WHERE NOT "IsDeleted";
    SELECT COUNT(*) INTO recipe_count FROM "Recipes" WHERE NOT "IsDeleted";
    IF category_count < 20 OR recipe_count < 100 THEN
        RAISE EXCEPTION 'Lab 2 requires >=20 categories and >=100 recipes; found % categories and % recipes.',
            category_count, recipe_count;
    END IF;

    SELECT COUNT(*) INTO incomplete_count
    FROM "Recipes" AS recipe
    WHERE NOT recipe."IsDeleted"
      AND (
        cardinality(recipe."Ingredients") < 10
        OR cardinality(recipe."Instructions") < 5
        OR (SELECT COUNT(*) FROM "RecipeIngredients" AS ingredient
            WHERE ingredient."RecipeId" = recipe."Id" AND BTRIM(ingredient."Name") <> '') < 10
        OR (SELECT COUNT(*) FROM "RecipeSteps" AS step
            WHERE step."RecipeId" = recipe."Id" AND BTRIM(step."Description") <> '') < 5
      );
    IF incomplete_count > 0 THEN
        RAISE EXCEPTION '% recipes do not have at least 10 ingredients and 5 steps in both stored representations.',
            incomplete_count;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM "Users" WHERE "Role" = 'Admin') THEN
        RAISE EXCEPTION 'The seeded database has no administrator account.';
    END IF;
END $$;

SELECT json_build_object(
    'categories', (SELECT COUNT(*) FROM "Categories" WHERE NOT "IsDeleted"),
    'recipes', (SELECT COUNT(*) FROM "Recipes" WHERE NOT "IsDeleted"),
    'users', (SELECT COUNT(*) FROM "Users"),
    'migrations', (SELECT COUNT(*) FROM "__EFMigrationsHistory"),
    'minimumIngredients', (SELECT MIN(content.count) FROM (
        SELECT COUNT(ingredient."Id") AS count FROM "Recipes" recipe
        LEFT JOIN "RecipeIngredients" ingredient ON ingredient."RecipeId" = recipe."Id"
        WHERE NOT recipe."IsDeleted" GROUP BY recipe."Id"
    ) content),
    'minimumSteps', (SELECT MIN(content.count) FROM (
        SELECT COUNT(step."Id") AS count FROM "Recipes" recipe
        LEFT JOIN "RecipeSteps" step ON step."RecipeId" = recipe."Id"
        WHERE NOT recipe."IsDeleted" GROUP BY recipe."Id"
    ) content)
) AS seed_verification;

SELECT category."Name", COUNT(recipe."Id") AS published_recipes
FROM "Categories" category
LEFT JOIN "Recipes" recipe ON recipe."CategoryId" = category."Id"
    AND NOT recipe."IsDeleted" AND recipe."Status" = 1
WHERE NOT category."IsDeleted"
GROUP BY category."Id", category."Name"
ORDER BY category."Name";

COMMIT;
