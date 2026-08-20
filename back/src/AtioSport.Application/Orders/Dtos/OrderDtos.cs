namespace AtioSport.Application.Orders.Dtos;

public record OrderItemRequestDto(Guid ProductId, int Quantity);

public record CreateOrderDto(string CustomerName, string CustomerPhone, List<OrderItemRequestDto> Items);

public record OrderItemDto(Guid ProductId, string ProductName, decimal UnitPrice, int Quantity);

public record OrderDto(Guid Id, string CustomerName, string CustomerPhone, List<OrderItemDto> Items);
