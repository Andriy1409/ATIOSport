using AtioSport.Application.Common.Exceptions;
using AtioSport.Application.Common.Interfaces;
using AtioSport.Application.Products.Dtos;
using AtioSport.Domain.Entities;

namespace AtioSport.Application.Products.Services;

public class ProductService(IProductRepository productRepository) : IProductService
{
    public async Task<List<ProductDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var products = await productRepository.GetAllAsync(cancellationToken);
        return products.Select(ToDto).ToList();
    }

    public async Task<ProductDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await productRepository.GetByIdAsync(id, cancellationToken);
        return product is null ? null : ToDto(product);
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto, CancellationToken cancellationToken = default)
    {
        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            StockQuantity = dto.StockQuantity,
            ImageUrl = dto.ImageUrl,
            CategoryId = dto.CategoryId
        };

        await productRepository.AddAsync(product, cancellationToken);
        await productRepository.SaveChangesAsync(cancellationToken);

        return ToDto(product);
    }

    public async Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto dto, CancellationToken cancellationToken = default)
    {
        var product = await productRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Product {id} was not found.");

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.StockQuantity = dto.StockQuantity;
        product.ImageUrl = dto.ImageUrl;
        product.CategoryId = dto.CategoryId;

        productRepository.Update(product);
        await productRepository.SaveChangesAsync(cancellationToken);

        return ToDto(product);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await productRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Product {id} was not found.");

        productRepository.Remove(product);
        await productRepository.SaveChangesAsync(cancellationToken);
    }

    private static ProductDto ToDto(Product product) => new(
        product.Id,
        product.Name,
        product.Description,
        product.Price,
        product.StockQuantity,
        product.ImageUrl,
        product.CategoryId);
}
