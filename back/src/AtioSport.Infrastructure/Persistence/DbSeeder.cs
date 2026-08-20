using AtioSport.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AtioSport.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var dbContext = services.GetRequiredService<AppDbContext>();
        await dbContext.Database.MigrateAsync();

        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        foreach (var role in new[] { "Admin", "Customer" })
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }
        }

        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var configuration = services.GetRequiredService<IConfiguration>();

        var adminEmail = configuration["AdminSeed:Email"] ?? "admin@atiosport.local";
        var adminPassword = configuration["AdminSeed:Password"] ?? "Admin123!";

        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser is null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                Name = "Admin",
                Phone = string.Empty,
                EmailConfirmed = true
            };

            await userManager.CreateAsync(adminUser, adminPassword);
        }

        if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }
}
