using AtioSport.Application.Categories.Dtos;
using AtioSport.Application.Categories.Services;
using Microsoft.AspNetCore.Mvc;

namespace AtioSport.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(ICategoryService categoryService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<CategoryDto>>> GetAll(CancellationToken cancellationToken)
    {
        var categories = await categoryService.GetAllAsync(cancellationToken);
        return Ok(categories);
    }
}
