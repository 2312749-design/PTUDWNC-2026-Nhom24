using System.Data;
using System.Text.Json;
using CulinaryBlog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Npgsql;

var connectionString = Environment.GetEnvironmentVariable("SCHEMA_CHECK_CONNECTION_STRING");
var modelOnly = args.Contains("--model-only", StringComparer.Ordinal);
if (string.IsNullOrWhiteSpace(connectionString) && !modelOnly)
{
    Console.Error.WriteLine("Set SCHEMA_CHECK_CONNECTION_STRING for the isolated PostgreSQL database.");
    return 2;
}

var options = new DbContextOptionsBuilder<ApplicationDbContext>()
    .UseNpgsql(connectionString ?? "Host=localhost;Database=model_only")
    .Options;
await using var context = new ApplicationDbContext(options);
var expected = context.Model.GetRelationalModel().Tables
    .SelectMany(table => table.Columns.Select(column =>
        (Schema: table.Schema ?? "public", Table: table.Name, Column: column.Name)))
    .ToArray();

if (modelOnly)
{
    Console.WriteLine(JsonSerializer.Serialize(new
    {
        mode = "model-only; database schema not checked",
        expectedTables = expected.Select(column => (column.Schema, column.Table)).Distinct().Count(),
        expectedColumns = expected.Length,
        columns = expected.Select(column => new { schema = column.Schema, table = column.Table, column = column.Column })
    }));
    return 0;
}

await using var connection = new NpgsqlConnection(connectionString);
await connection.OpenAsync();
await using var transaction = await connection.BeginTransactionAsync(IsolationLevel.ReadCommitted);
await using (var readOnly = new NpgsqlCommand("SET TRANSACTION READ ONLY", connection, transaction))
    await readOnly.ExecuteNonQueryAsync();

var actual = new HashSet<(string Schema, string Table, string Column)>();
await using (var command = new NpgsqlCommand("""
    SELECT table_schema, table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public';
    """, connection, transaction))
await using (var reader = await command.ExecuteReaderAsync())
    while (await reader.ReadAsync())
        actual.Add((reader.GetString(0), reader.GetString(1), reader.GetString(2)));

var missing = expected.Where(column => !actual.Contains(column))
    .Select(column => new { schema = column.Schema, table = column.Table, column = column.Column })
    .OrderBy(column => column.table).ThenBy(column => column.column)
    .ToArray();
Console.WriteLine("SCHEMA_CHECK_RESULT=" + JsonSerializer.Serialize(new
{
    passed = missing.Length == 0,
    expectedTables = expected.Select(column => (column.Schema, column.Table)).Distinct().Count(),
    expectedColumns = expected.Length,
    missing
}));
await transaction.CommitAsync();
return missing.Length == 0 ? 0 : 1;
