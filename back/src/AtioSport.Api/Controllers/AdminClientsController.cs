using AtioSport.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtioSport.Api.Controllers;

[ApiController]
[Route("api/admin/clients")]
[Authorize(Roles = "Admin")]
public class AdminClientsController(IIdentityService identityService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ClientDto>>> GetAll(CancellationToken cancellationToken)
    {
        var clients = await identityService.GetClientsAsync(cancellationToken);
        return Ok(clients);
    }
}
