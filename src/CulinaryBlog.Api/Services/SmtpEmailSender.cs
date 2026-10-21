using System.Net;
using System.Net.Mail;

namespace CulinaryBlog.Api.Services;

public sealed class SmtpEmailSender(IConfiguration configuration)
{
    public async Task SendPasswordResetAsync(
        string email,
        string resetUrl,
        CancellationToken cancellationToken)
    {
        var host = configuration["Email:Smtp:Host"];
        var fromAddress = configuration["Email:Smtp:FromAddress"];
        if (string.IsNullOrWhiteSpace(host) ||
            string.IsNullOrWhiteSpace(fromAddress))
        {
            throw new InvalidOperationException(
                "Configure Email:Smtp:Host and Email:Smtp:FromAddress before sending email.");
        }

        if (!int.TryParse(configuration["Email:Smtp:Port"], out var port) ||
            port is < 1 or > 65535)
        {
            throw new InvalidOperationException(
                "Configure Email:Smtp:Port with a valid port number.");
        }

        using var message = new MailMessage(fromAddress, email)
        {
            Subject = "Đặt lại mật khẩu Culinary Blog",
            Body = $"""
                <p>Bạn vừa yêu cầu đặt lại mật khẩu Culinary Blog.</p>
                <p><a href="{WebUtility.HtmlEncode(resetUrl)}">Đặt lại mật khẩu</a></p>
                <p>Liên kết có hiệu lực trong 30 phút. Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.</p>
                """,
            IsBodyHtml = true
        };

        using var client = new SmtpClient(host, port)
        {
            EnableSsl = configuration.GetValue("Email:Smtp:EnableSsl", true)
        };
        var username = configuration["Email:Smtp:Username"];
        var password = configuration["Email:Smtp:Password"];
        if (!string.IsNullOrWhiteSpace(username))
        {
            client.Credentials = new NetworkCredential(username, password);
        }

        await client.SendMailAsync(message, cancellationToken);
    }
}
