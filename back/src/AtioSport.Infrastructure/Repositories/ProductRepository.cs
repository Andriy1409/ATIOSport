using AtioSport.Application.Common.Interfaces;
using AtioSport.Domain.Entities;
using AtioSport.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AtioSport.Infrastructure.Repositories;

public class ProductRepository(AppDbContext dbContext) : Repository<Product>(dbContext), IProductRepository
{
    public async Task<List<Product>> GetByCategoryAsync(Guid categoryId, CancellationToken cancellationToken = default) =>
        await DbSet.Where(p => p.CategoryId == categoryId).ToListAsync(cancellationToken);
}
