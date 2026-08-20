using AtioSport.Application.Categories.Dtos;
using AtioSport.Application.Common.Interfaces;
using AtioSport.Domain.Entities;

namespace AtioSport.Application.Categories.Services;

public class CategoryService(IRepository<Category> categoryRepository) : ICategoryService
{
    public async Task<List<CategoryDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var categories = await categoryRepository.GetAllAsync(cancellationToken);
        return categories
            .Select(c => new CategoryDto(c.Id, c.Name, c.Slug, c.ParentCategoryId))
            .ToList();
    }
}
