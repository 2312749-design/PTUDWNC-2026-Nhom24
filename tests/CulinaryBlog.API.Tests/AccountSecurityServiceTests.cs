using System.Security.Cryptography;
using System.Text;
using CulinaryBlog.API.Services;
using Microsoft.AspNetCore.DataProtection;
using Xunit;

namespace CulinaryBlog.API.Tests;

public sealed class AccountSecurityServiceTests
{
    [Fact]
    public void Setup_CreatesScannableTotpSecret_AndAcceptsCurrentAuthenticatorCode()
    {
        var service = new AccountSecurityService(DataProtectionProvider.Create($"account-security-{Guid.NewGuid():N}"));

        var setup = service.CreateSetup("chef-demo");
        var protectedSecret = service.ProtectSecret(setup.Secret);

        Assert.StartsWith("otpauth://totp/", setup.OtpAuthUrl);
        Assert.StartsWith("data:image/svg+xml;base64,", setup.QrCodeDataUrl);
        Assert.Equal(setup.Secret, service.UnprotectSecret(protectedSecret));
        Assert.True(service.VerifyCode(protectedSecret, CreateCurrentTotp(setup.Secret)));
        Assert.False(service.VerifyCode(protectedSecret, "000000"));
    }

    [Fact]
    public void RecoveryCodeHash_IsCaseAndWhitespaceInsensitive()
    {
        var service = new AccountSecurityService(DataProtectionProvider.Create($"account-security-{Guid.NewGuid():N}"));
        var recoveryCode = service.CreateRecoveryCode();

        Assert.Equal(AccountSecurityService.Hash(recoveryCode), AccountSecurityService.Hash($"  {recoveryCode.ToLowerInvariant()}  "));
        Assert.Matches("^[A-F0-9]{5}-[A-F0-9]{5}$", recoveryCode);
    }

    private static string CreateCurrentTotp(string base32Secret)
    {
        const string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        var buffer = 0;
        var bits = 0;
        var secret = new List<byte>();
        foreach (var character in base32Secret)
        {
            buffer = (buffer << 5) | alphabet.IndexOf(character);
            bits += 5;
            if (bits >= 8)
            {
                secret.Add((byte)(buffer >> (bits - 8)));
                bits -= 8;
            }
        }

        var counter = DateTimeOffset.UtcNow.ToUnixTimeSeconds() / 30;
        var counterBytes = BitConverter.GetBytes(counter);
        if (BitConverter.IsLittleEndian) Array.Reverse(counterBytes);
        using var hmac = new HMACSHA1(secret.ToArray());
        var hash = hmac.ComputeHash(counterBytes);
        var offset = hash[^1] & 0x0f;
        var binary = ((hash[offset] & 0x7f) << 24) | (hash[offset + 1] << 16) | (hash[offset + 2] << 8) | hash[offset + 3];
        return (binary % 1_000_000).ToString("D6", System.Globalization.CultureInfo.InvariantCulture);
    }
}
