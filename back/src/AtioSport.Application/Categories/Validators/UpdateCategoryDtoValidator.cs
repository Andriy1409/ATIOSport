using AtioSport.Application.Categories.Dtos;
using FluentValidation;

namespace AtioSport.Application.Categories.Validators;

public class UpdateCategoryDtoValidator : AbstractValidator<UpdateCategoryDto>
{
    public UpdateCategoryDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    }
}
