using System;
using System.Collections.Generic;
using System.Text;

namespace CulinaryBlog.Domain.Entities
{
    public class Category
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property (Mối quan hệ 1-nhiều với Recipe)
        public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();

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
    }
}