using AtioSport.Application.Common.Exceptions;
using AtioSport.Application.Common.Interfaces;
using AtioSport.Application.Orders.Dtos;
using AtioSport.Domain.Entities;

namespace AtioSport.Application.Orders.Services;

public class OrderService(IProductRepository productRepository, IRepository<Order> orderRepository) : IOrderService
{
    public async Task<OrderDto> CreateAsync(CreateOrderDto dto, Guid? userId, CancellationToken cancellationToken = default)
    {
        var order = new Order
        {
            CustomerName = dto.CustomerName,
            CustomerPhone = dto.CustomerPhone,
            UserId = userId
        };

        foreach (var item in dto.Items)
        {
            var product = await productRepository.GetByIdAsync(item.ProductId, cancellationToken)
                ?? throw new NotFoundException($"Product {item.ProductId} was not found.");

            if (product.StockQuantity < item.Quantity)
            {
                throw new ConflictException($"Not enough stock for product '{product.Name}'.");
            }

            product.StockQuantity -= item.Quantity;

            order.OrderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                UnitPrice = product.Price,
                Quantity = item.Quantity
            });
        }

        await orderRepository.AddAsync(order, cancellationToken);
        await orderRepository.SaveChangesAsync(cancellationToken);

        return ToDto(order);
    }

    private static OrderDto ToDto(Order order) => new(
        order.Id,
        order.CustomerName,
        order.CustomerPhone,
        order.OrderItems.Select(i => new OrderItemDto(i.ProductId, i.ProductName, i.UnitPrice, i.Quantity)).ToList());
}
