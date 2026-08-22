namespace AtioSport.Application.Categories.Dtos;

public record CategoryDto(Guid Id, string Name, string Slug, Guid? ParentCategoryId);

public record CreateCategoryDto(string Name, Guid? ParentCategoryId);

public record UpdateCategoryDto(string Name, Guid? ParentCategoryId);
