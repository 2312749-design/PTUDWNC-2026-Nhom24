namespace CulinaryBlog.Domain.Exceptions;

public sealed class UnauthorizedException(string message) : DomainException(message)
{
}
