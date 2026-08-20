using AtioSport.Application.Products.Dtos;
using AtioSport.Application.Products.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtioSport.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IProductService productService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ProductDto>>> GetAll(CancellationToken cancellationToken)
    {
        var products = await productService.GetAllAsync(cancellationToken);
        return Ok(products);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var product = await productService.GetByIdAsync(id, cancellationToken);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductDto>> Create(CreateProductDto dto, CancellationToken cancellationToken)
    {
        var created = await productService.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ProductDto>> Update(Guid id, UpdateProductDto dto, CancellationToken cancellationToken)
    {
        var updated = await productService.UpdateAsync(id, dto, cancellationToken);
        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await productService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
