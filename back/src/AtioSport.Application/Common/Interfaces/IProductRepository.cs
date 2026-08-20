using AtioSport.Domain.Entities;

namespace AtioSport.Application.Common.Interfaces;

public interface IProductRepository : IRepository<Product>
{
    Task<List<Product>> GetByCategoryAsync(Guid categoryId, CancellationToken cancellationToken = default);
}
