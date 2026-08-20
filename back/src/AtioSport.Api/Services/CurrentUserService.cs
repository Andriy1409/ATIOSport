using System.Security.Claims;
using AtioSport.Application.Common.Interfaces;

namespace AtioSport.Api.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public Guid? UserId
    {
        get
        {
            var idClaim = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(idClaim, out var id) ? id : null;
        }
    }
}
