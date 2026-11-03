namespace CulinaryBlog.API.Configuration;

/// <summary>
/// Controls database work performed during application startup. Local and Docker
/// development keep both settings enabled so a fresh checkout is immediately
/// usable; deployed environments can turn them off after their migration and
/// seed process has run.
/// </summary>
public sealed class DatabaseInitializationOptions
{
    public bool ApplyMigrationsOnStartup { get; init; } = true;
    public bool SeedDemoDataOnStartup { get; init; } = true;
}
