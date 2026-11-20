using CulinaryBlog.Application.CQRS.Auth.Commands;
using FluentValidation;

namespace CulinaryBlog.Application.Validation;

public sealed class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(command => command.DisplayName ?? command.FullName).NotEmpty().MaximumLength(100).OverridePropertyName("displayName");
        RuleFor(command => command.Email).NotEmpty().EmailAddress().MaximumLength(254).OverridePropertyName("email");
        RuleFor(command => command.Username).MaximumLength(50).Must(value => string.IsNullOrWhiteSpace(value) || !value.Any(char.IsWhiteSpace))
            .WithMessage("Tên đăng nhập không được chứa khoảng trắng.").OverridePropertyName("username");
        RuleFor(command => command.Password).NotEmpty().MinimumLength(8).MaximumLength(128)
            .Matches("[A-Z]").Matches("[a-z]").Matches("[0-9]").Matches("[^a-zA-Z0-9]").OverridePropertyName("password");
        RuleFor(command => command.ConfirmPassword).Equal(command => command.Password).OverridePropertyName("confirmPassword");
        RuleFor(command => command.AvatarUrl).MaximumLength(2048).OverridePropertyName("avatarUrl");
        RuleFor(command => command.Bio).MaximumLength(500).OverridePropertyName("bio");
    }
}

public sealed class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(command => command).Must(command => !string.IsNullOrWhiteSpace(command.Email) || !string.IsNullOrWhiteSpace(command.Username))
            .WithMessage("Vui lòng nhập tên đăng nhập hoặc email.").OverridePropertyName("account");
        RuleFor(command => command.Password).NotEmpty().MaximumLength(128).OverridePropertyName("password");
        RuleFor(command => command.TwoFactorCode).MaximumLength(32).OverridePropertyName("twoFactorCode");
    }
}

public sealed class RefreshSessionCommandValidator : AbstractValidator<RefreshSessionCommand>
{
    public RefreshSessionCommandValidator() => RuleFor(command => command.RefreshToken).MaximumLength(1024).OverridePropertyName("refreshToken");
}

