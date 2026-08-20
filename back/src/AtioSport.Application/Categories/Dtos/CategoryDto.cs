namespace AtioSport.Application.Categories.Dtos;

public record CategoryDto(Guid Id, string Name, string Slug, Guid? ParentCategoryId);
