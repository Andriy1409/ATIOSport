using AtioSport.Application.Common.Interfaces;
using AtioSport.Domain.Entities;
using AtioSport.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AtioSport.Infrastructure.Repositories;

public class OrderRepository(AppDbContext dbContext) : Repository<Order>(dbContext), IOrderRepository
{
    public async Task<List<Order>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default) =>
        await DbSet
            .Include(o => o.OrderItems)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAtUtc)
            .ToListAsync(cancellationToken);
}
