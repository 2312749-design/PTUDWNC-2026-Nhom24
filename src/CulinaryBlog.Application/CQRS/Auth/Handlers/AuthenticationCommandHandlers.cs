using CulinaryBlog.Application.CQRS.Auth.Commands;
using CulinaryBlog.Application.Interfaces;
using MediatR;

namespace CulinaryBlog.Application.CQRS.Auth.Handlers;

public sealed class AuthenticationCommandHandlers(IAuthenticationWorkflow workflow) :
    IRequestHandler<RegisterCommand, object>,
    IRequestHandler<LoginCommand, object>,
    IRequestHandler<RefreshSessionCommand, object>
{
    public Task<object> Handle(RegisterCommand request, CancellationToken cancellationToken) => workflow.RegisterAsync(request, cancellationToken);
    public Task<object> Handle(LoginCommand request, CancellationToken cancellationToken) => workflow.LoginAsync(request, cancellationToken);
    public Task<object> Handle(RefreshSessionCommand request, CancellationToken cancellationToken) => workflow.RefreshAsync(request, cancellationToken);
}

