-- Keep imported recipe descriptions focused on the food itself.
-- This script is idempotent and is also run manually for an existing database.
UPDATE "Recipes"
SET "Description" = NULLIF(
    btrim(
        regexp_replace(
            regexp_replace(
                regexp_replace(
                    "Description",
                    '^\s*Công thức dữ liệu thật được biên soạn từ Điện Máy Xanh\.\s*',
                    '',
                    'i'
                ),
                '\s*Nguồn:\s*https?://(www\.)?dienmayxanh\.com/\S+\s*$',
                '',
                'i'
            ),
            '[^.!?]*(Điện Máy Xanh|dienmayxanh)[^.!?]*[.!?]?\s*',
            '',
            'gi'
        )
    ),
    ''
)
WHERE "Description" ~* '(Điện Máy Xanh|dienmayxanh|Công thức dữ liệu thật được biên soạn|Nguồn:\s*https?://)';

UPDATE "Recipes"
SET "Description" = "Title" || ' là món ăn thơm ngon với nguyên liệu gần gũi, cách chế biến rõ ràng và phù hợp cho bữa ăn gia đình.'
WHERE "Description" IS NULL OR btrim("Description") = '';

UPDATE "RecipeIngredients"
SET "Notes" = NULL
WHERE "Notes" ~* '(Điện Máy Xanh|dienmayxanh|Nguồn)';

UPDATE "Recipes"
SET "ReviewNote" = NULL
WHERE "ReviewNote" ~* '(Điện Máy Xanh|dienmayxanh|Nguồn)';
