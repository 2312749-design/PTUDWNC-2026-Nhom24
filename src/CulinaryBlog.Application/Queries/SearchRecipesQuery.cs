namespace CulinaryBlog.Application.Queries;

public sealed record SearchRecipesQuery(
    string Keyword,
    int Page,
    int PageSize);
