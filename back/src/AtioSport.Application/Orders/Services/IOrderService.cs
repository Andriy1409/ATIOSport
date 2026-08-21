using AtioSport.Application.Orders.Dtos;

namespace AtioSport.Application.Orders.Services;

public interface IOrderService
{
    Task<OrderDto> CreateAsync(CreateOrderDto dto, Guid? userId, CancellationToken cancellationToken = default);
    Task<List<OrderDto>> GetMyOrdersAsync(Guid userId, CancellationToken cancellationToken = default);
}
