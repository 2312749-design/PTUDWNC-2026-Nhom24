using FluentValidation;
using MediatR;

namespace CulinaryBlog.Application.Behaviors;

/// <summary>
/// Runs Application-layer validators before a command or query reaches its
/// handler. Endpoints only translate HTTP into a request; validation rules
/// remain independent from ASP.NET Core.
/// </summary>
public sealed class ValidationBehavior<TRequest, TResponse>(
    IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var validatorList = validators.ToArray();
        if (validatorList.Length == 0)
            return await next(cancellationToken);

        var context = new ValidationContext<TRequest>(request);
        var results = await Task.WhenAll(validatorList.Select(validator =>
            validator.ValidateAsync(context, cancellationToken)));
        var failures = results
            .SelectMany(result => result.Errors)
            .Where(failure => failure is not null)
            .ToArray();

        if (failures.Length > 0)
            throw new FluentValidation.ValidationException(failures);

        return await next(cancellationToken);
    }
}
