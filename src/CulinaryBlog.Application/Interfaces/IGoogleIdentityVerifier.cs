namespace CulinaryBlog.Application.Interfaces;

public sealed record GoogleIdentity(string Subject, string Email, bool EmailVerified, string? Name, string? Picture, string? HostedDomain);

public interface IGoogleIdentityVerifier
{
    Task<GoogleIdentity> VerifyAsync(string idToken, string clientId);
}
