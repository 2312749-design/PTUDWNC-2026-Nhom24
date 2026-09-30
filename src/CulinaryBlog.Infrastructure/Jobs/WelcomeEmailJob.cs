using Microsoft.Extensions.Logging;

namespace CulinaryBlog.Infrastructure.Jobs;

public class WelcomeEmailJob
{
    private readonly ILogger<WelcomeEmailJob> _logger;

    public WelcomeEmailJob(ILogger<WelcomeEmailJob> logger)
    {
        _logger = logger;
    }

    public void SendWelcomeEmail(string email)
    {
        _logger.LogInformation("[Hangfire] Sending welcome email to {Email} at {Time}", email, DateTime.UtcNow);
    }
}
