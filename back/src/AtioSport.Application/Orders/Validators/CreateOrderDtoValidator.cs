using AtioSport.Application.Orders.Dtos;
using FluentValidation;

namespace AtioSport.Application.Orders.Validators;

public class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>
{
    public CreateOrderDtoValidator()
    {
        RuleFor(x => x.CustomerName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.CustomerPhone).NotEmpty().MaximumLength(30);
        RuleFor(x => x.Items).NotEmpty();
        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.ProductId).NotEmpty();
            item.RuleFor(i => i.Quantity).GreaterThan(0);
        });
    }
}
