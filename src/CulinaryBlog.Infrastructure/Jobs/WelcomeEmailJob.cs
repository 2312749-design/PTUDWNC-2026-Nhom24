using CulinaryBlog.Application.Interfaces;

namespace CulinaryBlog.Infrastructure.Jobs;

public sealed class WelcomeEmailJob(IEmailSender emailSender)
{
    public Task SendWelcomeEmail(string email)
    {
        const string subject = "Chào mừng bạn đến với Bếp Nhà";
        const string body = "<h1>Chào mừng bạn đến với Bếp Nhà</h1><p>Cảm ơn bạn đã tham gia cộng đồng ẩm thực. Hãy bắt đầu lưu và chia sẻ công thức đầu tiên của mình nhé!</p>";
        return emailSender.SendAsync(email, subject, body);
    }
}
