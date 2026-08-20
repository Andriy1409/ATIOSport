using AtioSport.Application.Categories.Dtos;

namespace AtioSport.Application.Categories.Services;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllAsync(CancellationToken cancellationToken = default);
}
