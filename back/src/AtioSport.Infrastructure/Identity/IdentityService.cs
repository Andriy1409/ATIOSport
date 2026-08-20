using AtioSport.Application.Common.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AtioSport.Infrastructure.Identity;

public class IdentityService(
    UserManager<ApplicationUser> userManager,
    JwtTokenGenerator tokenGenerator) : IIdentityService
{
    public async Task<RegisterResult> RegisterAsync(string name, string email, string phone, string password, CancellationToken cancellationToken = default)
    {
        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            Name = name,
            Phone = phone
        };

        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            return new RegisterResult(false, result.Errors.Select(e => e.Description).ToList());
        }

        await userManager.AddToRoleAsync(user, "Customer");
        return new RegisterResult(true, []);
    }

    public async Task<string?> LoginAsync(string email, string password, CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null || !await userManager.CheckPasswordAsync(user, password))
        {
            return null;
        }

        var roles = await userManager.GetRolesAsync(user);
        return tokenGenerator.GenerateToken(user, roles);
    }

    public async Task<CurrentUserDto?> GetCurrentUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());
        return user is null ? null : new CurrentUserDto(user.Id, user.Name, user.Email ?? string.Empty);
    }

    public async Task<List<ClientDto>> GetClientsAsync(CancellationToken cancellationToken = default)
    {
        return await userManager.Users
            .Select(u => new ClientDto(u.Id, u.Name, u.Email ?? string.Empty, u.Phone))
            .ToListAsync(cancellationToken);
    }
}
