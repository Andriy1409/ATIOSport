using AtioSport.Application.Auth.Dtos;
using AtioSport.Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AtioSport.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IIdentityService identityService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto dto, CancellationToken cancellationToken)
    {
        var result = await identityService.RegisterAsync(dto.Name, dto.Email, dto.Phone, dto.Password, cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(new { errors = result.Errors });
        }

        return Ok();
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto, CancellationToken cancellationToken)
    {
        var token = await identityService.LoginAsync(dto.Email, dto.Password, cancellationToken);
        if (token is null)
        {
            return Unauthorized();
        }

        return Ok(new AuthResponseDto(token));
    }
}
