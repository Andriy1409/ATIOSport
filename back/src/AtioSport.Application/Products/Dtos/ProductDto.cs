namespace AtioSport.Application.Products.Dtos;

public record ProductDto(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    string? ImageUrl,
    Guid CategoryId);

public record CreateProductDto(
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    string? ImageUrl,
    Guid CategoryId);
