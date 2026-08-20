using System.Reflection;
using AtioSport.Application.Categories.Services;
using AtioSport.Application.Orders.Services;
using AtioSport.Application.Products.Services;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace AtioSport.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IOrderService, OrderService>();

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        return services;
    }
}
