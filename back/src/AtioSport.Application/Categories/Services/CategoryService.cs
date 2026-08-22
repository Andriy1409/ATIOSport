using System.Text.RegularExpressions;
using AtioSport.Application.Categories.Dtos;
using AtioSport.Application.Common.Exceptions;
using AtioSport.Application.Common.Interfaces;
using AtioSport.Domain.Entities;

namespace AtioSport.Application.Categories.Services;

public partial class CategoryService(IRepository<Category> categoryRepository, IProductRepository productRepository) : ICategoryService
{
    public async Task<List<CategoryDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var categories = await categoryRepository.GetAllAsync(cancellationToken);
        return categories
            .Select(c => new CategoryDto(c.Id, c.Name, c.Slug, c.ParentCategoryId))
            .ToList();
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto, CancellationToken cancellationToken = default)
    {
        var categories = await categoryRepository.GetAllAsync(cancellationToken);

        if (dto.ParentCategoryId is { } parentId && categories.All(c => c.Id != parentId))
        {
            throw new NotFoundException($"Category {parentId} was not found.");
        }

        var existingSlugs = categories.Select(c => c.Slug).ToHashSet();
        var slug = MakeUniqueSlug(dto.Name, existingSlugs);

        var category = new Category
        {
            Name = dto.Name,
            Slug = slug,
            ParentCategoryId = dto.ParentCategoryId
        };

        await categoryRepository.AddAsync(category, cancellationToken);
        await categoryRepository.SaveChangesAsync(cancellationToken);

        return new CategoryDto(category.Id, category.Name, category.Slug, category.ParentCategoryId);
    }

    public async Task<CategoryDto> UpdateAsync(Guid id, UpdateCategoryDto dto, CancellationToken cancellationToken = default)
    {
        var category = await categoryRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Category {id} was not found.");

        if (dto.ParentCategoryId is { } parentId)
        {
            if (parentId == id)
            {
                throw new ConflictException("A category cannot be its own parent.");
            }

            var parent = await categoryRepository.GetByIdAsync(parentId, cancellationToken)
                ?? throw new NotFoundException($"Category {parentId} was not found.");

            if (parent.ParentCategoryId == id)
            {
                throw new ConflictException("Cannot set a subcategory as the parent.");
            }
        }

        category.Name = dto.Name;
        category.ParentCategoryId = dto.ParentCategoryId;

        categoryRepository.Update(category);
        await categoryRepository.SaveChangesAsync(cancellationToken);

        return new CategoryDto(category.Id, category.Name, category.Slug, category.ParentCategoryId);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var category = await categoryRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Category {id} was not found.");

        var categories = await categoryRepository.GetAllAsync(cancellationToken);
        if (categories.Any(c => c.ParentCategoryId == id))
        {
            throw new ConflictException("Delete or reassign its subcategories first.");
        }

        var products = await productRepository.GetAllAsync(cancellationToken);
        if (products.Any(p => p.CategoryId == id))
        {
            throw new ConflictException("Reassign or delete its products first.");
        }

        categoryRepository.Remove(category);
        await categoryRepository.SaveChangesAsync(cancellationToken);
    }

    private static string MakeUniqueSlug(string name, HashSet<string> existingSlugs)
    {
        var baseSlug = Slugify(name);
        var slug = baseSlug;
        var suffix = 2;
        while (existingSlugs.Contains(slug))
        {
            slug = $"{baseSlug}-{suffix}";
            suffix++;
        }
        return slug;
    }

    private static string Slugify(string name)
    {
        var lowered = name.Trim().ToLowerInvariant();
        var slug = NonAlphanumericRegex().Replace(lowered, "-").Trim('-');
        return slug.Length > 0 ? slug : "category";
    }

    [GeneratedRegex("[^a-z0-9]+")]
    private static partial Regex NonAlphanumericRegex();
}
