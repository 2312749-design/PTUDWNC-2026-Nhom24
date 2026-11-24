-- Classify published recipes by actual preparation complexity instead of
-- assigning every imported item to Medium. The weighted score considers total
-- time, ingredient count, step count and instruction detail. Extra weight keeps
-- exceptionally long or elaborate recipes in the upper tiers. NTILE keeps the
-- four difficulty groups as even as the recipe count permits.
WITH features AS (
    SELECT
        "Id",
        COALESCE(NULLIF("CookingTimeMinutes", 0), "PrepTimeMinutes" + "CookTimeMinutes") AS minutes,
        cardinality("Ingredients") AS ingredient_count,
        cardinality("Instructions") AS step_count,
        COALESCE((SELECT SUM(length(step)) FROM unnest("Instructions") AS step), 0) AS instruction_chars
    FROM "Recipes"
    WHERE "Status" = 1 AND NOT "IsDeleted"
), scored AS (
    SELECT
        "Id",
        0.40 * percent_rank() OVER (ORDER BY minutes)
        + 0.25 * percent_rank() OVER (ORDER BY ingredient_count)
        + 0.25 * percent_rank() OVER (ORDER BY step_count)
        + 0.10 * percent_rank() OVER (ORDER BY instruction_chars)
        + CASE WHEN minutes >= 240 THEN 0.30 WHEN minutes >= 120 THEN 0.15 WHEN minutes >= 90 THEN 0.05 ELSE 0 END
        + CASE WHEN ingredient_count >= 18 THEN 0.12 WHEN ingredient_count >= 14 THEN 0.06 ELSE 0 END
        + CASE WHEN step_count >= 10 THEN 0.12 WHEN step_count >= 8 THEN 0.06 ELSE 0 END AS complexity_score
    FROM features
), ranked AS (
    SELECT "Id", ntile(4) OVER (ORDER BY complexity_score, "Id") AS difficulty_tier
    FROM scored
)
UPDATE "Recipes" AS recipe
SET "Difficulty" = CASE ranked.difficulty_tier
        WHEN 1 THEN 'Easy'
        WHEN 2 THEN 'Medium'
        WHEN 3 THEN 'Hard'
        ELSE 'Expert'
    END,
    "UpdatedAt" = NOW()
FROM ranked
WHERE recipe."Id" = ranked."Id";
