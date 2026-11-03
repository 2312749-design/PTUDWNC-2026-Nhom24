using CulinaryBlog.Application.Interfaces;

namespace CulinaryBlog.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork, IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly Dictionary<Type, object> _repositories = new();

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public IRepository<T> Repository<T>() where T : class
    {
        var type = typeof(T);

        if (_repositories.TryGetValue(type, out var repository))
        {
            return (IRepository<T>)repository;
        }

        var concreteRepository = new Repository<T>(_context);
        _repositories[type] = concreteRepository;
        return concreteRepository;
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        => _context.SaveChangesAsync(cancellationToken);

    public ValueTask DisposeAsync()
        => _context.DisposeAsync();

    // DI scopes may be disposed synchronously (for example in validation
    // failures and conventional request pipelines). Supporting both disposal
    // forms prevents an otherwise successful request from throwing on scope
    // teardown.
    public void Dispose()
        => _context.Dispose();
}
