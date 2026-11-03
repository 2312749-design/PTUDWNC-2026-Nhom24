using Hangfire.Dashboard;

namespace CulinaryBlog.API.Middleware;

/// <summary>
/// Hangfire exposes operational data and job controls, so it is restricted to
/// authenticated administrators in every environment.
/// </summary>
public sealed class HangfireDashboardAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        var user = context.GetHttpContext().User;
        return user.Identity?.IsAuthenticated == true && user.IsInRole("Admin");
    }
}
