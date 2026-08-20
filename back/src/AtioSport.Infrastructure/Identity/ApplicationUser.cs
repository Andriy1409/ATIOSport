using Microsoft.AspNetCore.Identity;

namespace AtioSport.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}
