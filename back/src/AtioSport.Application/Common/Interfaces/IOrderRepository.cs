using AtioSport.Domain.Entities;

namespace AtioSport.Application.Common.Interfaces;

public interface IOrderRepository : IRepository<Order>
{
    Task<List<Order>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
}
