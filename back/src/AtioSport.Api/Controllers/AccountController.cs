using System.Security.Claims;
using AtioSport.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtioSport.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccountController(IIdentityService identityService) : ControllerBase
{
    [HttpGet("me")]
    public async Task<ActionResult<CurrentUserDto>> Me(CancellationToken cancellationToken)
    {
        var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(idClaim, out var userId))
        {
            return Unauthorized();
        }

        var user = await identityService.GetCurrentUserAsync(userId, cancellationToken);
        return user is null ? NotFound() : Ok(user);
    }
}
