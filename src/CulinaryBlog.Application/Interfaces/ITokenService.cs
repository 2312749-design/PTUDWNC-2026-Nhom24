using CulinaryBlog.Domain.Entities;

namespace CulinaryBlog.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateAccessToken(ApplicationUser user);
        RefreshToken GenerateRefreshToken(string ipAddress);
    }
}