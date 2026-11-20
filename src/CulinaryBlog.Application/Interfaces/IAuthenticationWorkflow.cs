using CulinaryBlog.Application.CQRS.Auth.Commands;

namespace CulinaryBlog.Application.Interfaces;

/// <summary>
/// HTTP-sensitive authentication work (secure cookies and atomic refresh-token
/// rotation) is hidden behind this port while MediatR owns the use-case entry.
/// </summary>
public interface IAuthenticationWorkflow
{
    Task<object> RegisterAsync(RegisterCommand command, CancellationToken cancellationToken);
    Task<object> LoginAsync(LoginCommand command, CancellationToken cancellationToken);
    Task<object> RefreshAsync(RefreshSessionCommand command, CancellationToken cancellationToken);
}

