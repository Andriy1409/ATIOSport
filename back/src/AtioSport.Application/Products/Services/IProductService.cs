using AtioSport.Application.Products.Dtos;

namespace AtioSport.Application.Products.Services;

public interface IProductService
{
    Task<List<ProductDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ProductDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ProductDto> CreateAsync(CreateProductDto dto, CancellationToken cancellationToken = default);
    Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto dto, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
