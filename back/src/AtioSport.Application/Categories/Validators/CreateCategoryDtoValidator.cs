using AtioSport.Application.Categories.Dtos;
using FluentValidation;

namespace AtioSport.Application.Categories.Validators;

public class CreateCategoryDtoValidator : AbstractValidator<CreateCategoryDto>
{
    public CreateCategoryDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    }
}
