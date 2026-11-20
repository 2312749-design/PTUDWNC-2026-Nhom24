using MediatR;

namespace CulinaryBlog.Application.CQRS.Auth.Commands;

public sealed record RegisterCommand(
    string? DisplayName, string? FullName, string? AvatarUrl, string? Bio,
    string? Username, string? Email, string? Password, string? ConfirmPassword,
    string? CaptchaQuestion, string? CaptchaAnswer) : IRequest<object>;

public sealed record LoginCommand(
    string? Email, string? Username, string? Password, string? TwoFactorCode) : IRequest<object>;

public sealed record RefreshSessionCommand(string? RefreshToken) : IRequest<object>;

