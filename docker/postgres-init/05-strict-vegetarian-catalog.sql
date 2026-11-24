-- The public vegetarian filter is intentionally strict: recipes that imitate
-- named meat/fish dishes are excluded even when their ingredients are plant
-- based. This keeps the result visually unambiguous for users browsing for
-- vegetable, mushroom, tofu and grain dishes.
UPDATE "Recipes"
SET "IsVegetarian" = false,
    "UpdatedAt" = NOW()
WHERE "Status" = 1
  AND NOT "IsDeleted"
  AND "IsVegetarian"
  AND lower("Title") ~ '(^|[^[:alpha:]])(thịt|cá|bò|gà|heo|lợn|tôm|cua|mực|vịt|dê|cừu|ếch|lươn|ốc|sườn)([^[:alpha:]]|$)';
