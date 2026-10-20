using System;
using System.Collections.Generic;
using System.Text;
using System.Globalization;

namespace CulinaryBlog.Domain.Entities
{
    public class Category
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property (Mối quan hệ 1-nhiều với Recipe)
        public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();

        public static Category Create(string name, string? description, string? imageUrl)
        {
            var category = new Category();
            category.Update(name, description, imageUrl);
            return category;
        }

        public void Update(string name, string? description, string? imageUrl)
        {
            var normalizedName = name?.Trim() ?? string.Empty;
            if (normalizedName.Length is < 2 or > 100)
                throw new CulinaryBlog.Domain.Exceptions.ValidationException("Tên danh mục phải có từ 2 đến 100 ký tự.");
            if (description?.Length > 500)
                throw new CulinaryBlog.Domain.Exceptions.ValidationException("Mô tả danh mục tối đa 500 ký tự.");

            Name = normalizedName;
            Slug = CreateSlug(normalizedName);
            Description = description?.Trim() ?? string.Empty;
            ImageUrl = string.IsNullOrWhiteSpace(imageUrl) ? null : imageUrl.Trim();
            UpdatedAt = DateTime.UtcNow;
        }

        public void SoftDelete()
        {
            if (IsDeleted)
            {
                return;
            }

            IsDeleted = true;
            DeletedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public static string CreateSlug(string value)
        {
            var normalized = value.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD);
            var builder = new StringBuilder(normalized.Length);
            var lastWasDash = false;
            foreach (var character in normalized)
            {
                if (CharUnicodeInfo.GetUnicodeCategory(character) == UnicodeCategory.NonSpacingMark) continue;
                var output = character is 'đ' ? 'd' : character;
                if (char.IsLetterOrDigit(output))
                {
                    builder.Append(output);
                    lastWasDash = false;
                }
                else if (!lastWasDash && builder.Length > 0)
                {
                    builder.Append('-');
                    lastWasDash = true;
                }
            }
            return builder.ToString().Trim('-');
        }
    }
}
