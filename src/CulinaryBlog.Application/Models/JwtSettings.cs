namespace CulinaryBlog.Application.Models
{
    public class JwtSettings
    {
        public string Secret { get; set; } = string.Empty;
        public int ExpiryMinutes { get; set; }
        public int RefreshTokenExpiryDays { get; set; }
    }
}