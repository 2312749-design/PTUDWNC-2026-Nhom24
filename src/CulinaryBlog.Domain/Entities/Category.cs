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

        // Navigation property (Mối quan hệ 1-nhiều với Recipe)
        public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
    }
}