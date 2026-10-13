namespace CulinaryBlog.Application.Queries;

public sealed record PaginatedResult<T>(
    IReadOnlyList<T> Items,
    int TotalCount,
    int Page,
    int TotalPages);
