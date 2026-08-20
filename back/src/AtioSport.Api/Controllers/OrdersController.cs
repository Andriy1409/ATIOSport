using AtioSport.Application.Common.Interfaces;
using AtioSport.Application.Orders.Dtos;
using AtioSport.Application.Orders.Services;
using Microsoft.AspNetCore.Mvc;

namespace AtioSport.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController(IOrderService orderService, ICurrentUserService currentUserService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<OrderDto>> Create(CreateOrderDto dto, CancellationToken cancellationToken)
    {
        var order = await orderService.CreateAsync(dto, currentUserService.UserId, cancellationToken);
        return Ok(order);
    }
}
