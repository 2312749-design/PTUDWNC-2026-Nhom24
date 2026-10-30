using System.Security.Cryptography;
using System.Text;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.AspNetCore.DataProtection;
using QRCoder;

namespace CulinaryBlog.API.Services;

public sealed class AccountSecurityService(IDataProtectionProvider protectionProvider)
{
    private const string Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    private readonly IDataProtector _protector = protectionProvider.CreateProtector("CulinaryBlog.AccountSecurity.Totp.v1");

    public string CreateProtectedSecret() => _protector.Protect(CreateSecret());
    public string ProtectSecret(string secret) => _protector.Protect(secret);
    public string UnprotectSecret(string protectedSecret) => _protector.Unprotect(protectedSecret);
    public string CreateRecoveryCode()
    {
        var bytes = RandomNumberGenerator.GetBytes(5);
        return $"{Convert.ToHexString(bytes)[..5]}-{Convert.ToHexString(bytes)[5..]}";
    }
    public static string Hash(string value) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(value.Trim().ToUpperInvariant())));
    public static string CreateEmailCode() => RandomNumberGenerator.GetInt32(100000, 1000000).ToString(System.Globalization.CultureInfo.InvariantCulture);

    public bool VerifyCode(string protectedSecret, string? code)
    {
        if (string.IsNullOrWhiteSpace(code)) return false;
        var normalized = new string(code.Where(char.IsDigit).ToArray());
        if (normalized.Length != 6 || !int.TryParse(normalized, out _)) return false;
        var secret = DecodeBase32(UnprotectSecret(protectedSecret));
        var current = DateTimeOffset.UtcNow.ToUnixTimeSeconds() / 30;
        return Enumerable.Range(-1, 3).Any(offset => FixedTimeEquals(CreateCode(secret, current + offset), normalized));
    }

    public (string Secret, string OtpAuthUrl, string QrCodeDataUrl) CreateSetup(string username)
    {
        var secret = CreateSecret();
        var issuer = "Bep Nha";
        var label = Uri.EscapeDataString($"{issuer}:{username}");
        var payload = $"otpauth://totp/{label}?secret={secret}&issuer={Uri.EscapeDataString(issuer)}&algorithm=SHA1&digits=6&period=30";
        using var generator = new QRCodeGenerator();
        using var data = generator.CreateQrCode(payload, QRCodeGenerator.ECCLevel.Q);
        var svg = new SvgQRCode(data).GetGraphic(5);
        return (secret, payload, $"data:image/svg+xml;base64,{Convert.ToBase64String(Encoding.UTF8.GetBytes(svg))}");
    }

    public Task LogAsync(ApplicationDbContext db, string userId, string activityType, string description, HttpContext context)
    {
        db.UserActivityLogs.Add(new UserActivityLog
        {
            UserId = userId,
            ActivityType = activityType,
            Description = description[..Math.Min(description.Length, 500)],
            IpAddress = context.Connection.RemoteIpAddress?.ToString(),
            UserAgent = context.Request.Headers.UserAgent.ToString()[..Math.Min(context.Request.Headers.UserAgent.ToString().Length, 512)]
        });
        return Task.CompletedTask;
    }

    private static bool FixedTimeEquals(string left, string right) => CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(left), Encoding.UTF8.GetBytes(right));
    private static string CreateSecret() => EncodeBase32(RandomNumberGenerator.GetBytes(20));
    private static string CreateCode(byte[] secret, long counter)
    {
        var counterBytes = BitConverter.GetBytes(counter);
        if (BitConverter.IsLittleEndian) Array.Reverse(counterBytes);
        using var hmac = new HMACSHA1(secret);
        var hash = hmac.ComputeHash(counterBytes);
        var offset = hash[^1] & 0x0f;
        var binary = ((hash[offset] & 0x7f) << 24) | (hash[offset + 1] << 16) | (hash[offset + 2] << 8) | hash[offset + 3];
        return (binary % 1_000_000).ToString("D6", System.Globalization.CultureInfo.InvariantCulture);
    }
    private static string EncodeBase32(byte[] input)
    {
        var result = new StringBuilder((input.Length * 8 + 4) / 5); int buffer = 0, bits = 0;
        foreach (var value in input) { buffer = (buffer << 8) | value; bits += 8; while (bits >= 5) { result.Append(Alphabet[(buffer >> (bits - 5)) & 31]); bits -= 5; } }
        if (bits > 0) result.Append(Alphabet[(buffer << (5 - bits)) & 31]);
        return result.ToString();
    }
    private static byte[] DecodeBase32(string value)
    {
        var bytes = new List<byte>(); int buffer = 0, bits = 0;
        foreach (var raw in value.Where(character => character != '=' && !char.IsWhiteSpace(character)))
        {
            var index = Alphabet.IndexOf(char.ToUpperInvariant(raw));
            if (index < 0) throw new CryptographicException("Khóa xác thực không hợp lệ.");
            buffer = (buffer << 5) | index; bits += 5;
            if (bits >= 8) { bytes.Add((byte)(buffer >> (bits - 8))); bits -= 8; }
        }
        return bytes.ToArray();
    }
}
