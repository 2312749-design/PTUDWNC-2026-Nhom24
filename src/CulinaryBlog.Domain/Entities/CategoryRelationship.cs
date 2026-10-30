namespace CulinaryBlog.Domain.Entities;

/// <summary>Optional parent-child category link; legacy categories remain roots.</summary>
public class CategoryRelationship
{
    public Guid ChildCategoryId { get; set; }
    public Category ChildCategory { get; set; } = null!;
    public Guid ParentCategoryId { get; set; }
    public Category ParentCategory { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
