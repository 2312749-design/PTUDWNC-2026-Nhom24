namespace CulinaryBlog.Domain.Exceptions;

public sealed class ConcurrencyConflictException(string message) : DomainException(message);
