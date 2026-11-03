using CulinaryBlog.Application.Interfaces;
using Google.Apis.Auth;

namespace CulinaryBlog.Infrastructure.Services;

public sealed class GoogleIdentityVerifier : IGoogleIdentityVerifier
{
    public async Task<GoogleIdentity> VerifyAsync(string idToken, string clientId)
    {
        // Google validates signature, issuer, audience and lifetime; never decode and trust client claims.
        var payload = await GoogleJsonWebSignature.ValidateAsync(idToken,
            new GoogleJsonWebSignature.ValidationSettings { Audience = [clientId] });
        return new GoogleIdentity(payload.Subject, payload.Email, payload.EmailVerified, payload.Name, payload.Picture, payload.HostedDomain);
    }
}
