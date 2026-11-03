using System.Security.Claims;
using CulinaryBlog.Domain.Entities;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CulinaryBlog.API.Endpoints;

public static class CookingSessionEndpoints
{
    public static void MapCookingSessions(this IEndpointRouteBuilder app)
    {
        var sessions = app.MapGroup("/api/v1/features/cooking-sessions").WithTags("Cooking sessions");
        sessions.MapGet("", async (HttpContext context, ApplicationDbContext db) =>
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = context.User.IsInRole("Admin");
            var items = await db.CookingEvents.AsNoTracking().OrderByDescending(item => item.StartsAt)
                .Take(100).Select(item => new
                {
                    item.Id, item.Title, item.Description, item.StartsAt, item.EndsAt, item.Capacity,
                    host = item.CreatedBy.FullName, hostId = item.CreatedById,
                    joined = db.CookingEventRegistrations.Count(registration => registration.EventId == item.Id),
                    joinedByMe = userId != null && db.CookingEventRegistrations.Any(registration => registration.EventId == item.Id && registration.UserId == userId),
                    canManage = item.CreatedById == userId || isAdmin
                }).ToListAsync();
            return new ApiResponseResult(200, new { items });
        }).AllowAnonymous();
        sessions.MapPost("", async (CookingSessionRequest request, HttpContext context, ApplicationDbContext db) =>
        {
            var title = request.Title?.Trim() ?? string.Empty;
            var description = request.Description?.Trim() ?? string.Empty;
            var startsAt = request.StartsAt.ToUniversalTime();
            if (title.Length is < 3 or > 160 || description.Length > 3000 || request.DurationMinutes is < 15 or > 1440 || request.Capacity is < 2 or > 100)
                return new ApiResponseResult(400, new { message = "Tên buổi nấu cần 3–160 ký tự, thời lượng 15–1440 phút và sức chứa 2–100 người." });
            if (startsAt <= DateTime.UtcNow || startsAt > DateTime.UtcNow.AddYears(1))
                return new ApiResponseResult(400, new { message = "Chọn thời gian bắt đầu trong tương lai, tối đa một năm." });
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var item = new CookingEvent
            {
                Title = title, Description = description, StartsAt = startsAt,
                EndsAt = startsAt.AddMinutes(request.DurationMinutes), Capacity = request.Capacity, CreatedById = userId
            };
            db.CookingEvents.Add(item);
            db.CookingEventRegistrations.Add(new CookingEventRegistration { EventId = item.Id, UserId = userId });
            await db.SaveChangesAsync();
            return new ApiResponseResult(201, new { item.Id, item.Title });
        }).RequireAuthorization();
        sessions.MapDelete("/{id:guid}/join", async (Guid id, HttpContext context, ApplicationDbContext db) =>
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var session = await db.CookingEvents.FindAsync(id);
            if (session is null) return new ApiResponseResult(404, new { message = "Không tìm thấy buổi nấu." });
            if (session.CreatedById == userId) return new ApiResponseResult(400, new { message = "Người chủ trì có thể hủy buổi nấu thay vì rời buổi." });
            var registration = await db.CookingEventRegistrations.FindAsync(id, userId);
            if (registration is not null) db.CookingEventRegistrations.Remove(registration);
            await db.SaveChangesAsync();
            return new ApiResponseResult(200, new { joined = false });
        }).RequireAuthorization();
        sessions.MapDelete("/{id:guid}", async (Guid id, HttpContext context, ApplicationDbContext db) =>
        {
            var item = await db.CookingEvents.FindAsync(id);
            if (item is null) return new ApiResponseResult(404, new { message = "Không tìm thấy buổi nấu." });
            if (item.CreatedById != context.User.FindFirstValue(ClaimTypes.NameIdentifier) && !context.User.IsInRole("Admin"))
                return new ApiResponseResult(403, new { message = "Chỉ người chủ trì hoặc Admin được hủy buổi nấu." });
            db.CookingEvents.Remove(item);
            await db.SaveChangesAsync();
            return new ApiResponseResult(200, new { deleted = true });
        }).RequireAuthorization();
    }
}

public sealed record CookingSessionRequest(string? Title, string? Description, DateTime StartsAt, int DurationMinutes, int Capacity);
