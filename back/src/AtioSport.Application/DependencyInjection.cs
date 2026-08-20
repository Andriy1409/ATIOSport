using AtioSport.Application.Products.Services;
using Microsoft.Extensions.DependencyInjection;

namespace AtioSport.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IProductService, ProductService>();
        return services;
    }
}
