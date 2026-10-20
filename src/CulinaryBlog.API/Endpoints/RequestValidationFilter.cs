using System.Collections;
using System.ComponentModel.DataAnnotations;

namespace CulinaryBlog.API.Endpoints;

public sealed class RequestValidationFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var errors = new Dictionary<string, string[]>();
        var visited = new HashSet<object>(ReferenceEqualityComparer.Instance);
        foreach (var value in context.Arguments)
            if (value is not EndpointHandler && value?.GetType().Namespace?.StartsWith("CulinaryBlog", StringComparison.Ordinal) == true)
                Validate(value, "", errors, visited);
        return errors.Count > 0 ? Results.ValidationProblem(errors, detail: "Dữ liệu gửi lên không hợp lệ. Kiểm tra các trường trong errors.") : await next(context);
    }

    private static void Validate(object? value, string path, Dictionary<string, string[]> errors, HashSet<object> visited)
    {
        if (value is null || value is string || value.GetType().IsValueType || !visited.Add(value)) return;
        if (value is IEnumerable items)
        {
            var index = 0;
            foreach (var item in items) Validate(item, $"{path}[{index++}]", errors, visited);
            return;
        }
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(value, new ValidationContext(value), results, true);
        foreach (var result in results)
            foreach (var member in result.MemberNames.DefaultIfEmpty(""))
            {
                var key = string.IsNullOrEmpty(path) ? member : $"{path}.{member}";
                errors[key] = errors.GetValueOrDefault(key, []).Append(result.ErrorMessage ?? "Invalid value.").ToArray();
            }
        foreach (var property in value.GetType().GetProperties().Where(p => p.CanRead && p.GetIndexParameters().Length == 0))
            Validate(property.GetValue(value), string.IsNullOrEmpty(path) ? property.Name : $"{path}.{property.Name}", errors, visited);
    }
}
