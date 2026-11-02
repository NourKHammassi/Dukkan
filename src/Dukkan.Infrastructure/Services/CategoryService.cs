using Dukkan.Application.DTOs.Category;
using Dukkan.Application.Interfaces;
using Dukkan.Domain.Entities;
using Dukkan.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Dukkan.Infrastructure.Services;

public class CategoryService : ICategoryService
{
    private readonly DukkanDbContext _context;

    public CategoryService(DukkanDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoryDto>> GetAllAsync()
    {
        var categories = await _context.Categories
            .Include(c => c.Children)
            .Where(c => c.ParentId == null)
            .ToListAsync();

        return categories.Select(MapToDto).ToList();
    }

    public async Task<CategoryDto> GetByIdAsync(Guid id)
    {
        var category = await _context.Categories
            .Include(c => c.Children)
            .FirstOrDefaultAsync(c => c.Id == id)
            ?? throw new Exception("Category not found");

        return MapToDto(category);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
    {
        var slug = dto.Name.ToLower().Replace(" ", "-");

        if (await _context.Categories.AnyAsync(c => c.Slug == slug))
            throw new Exception("Category with this name already exists");

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Slug = slug,
            Icon = dto.Icon,
            ParentId = dto.ParentId
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return MapToDto(category);
    }

    public async Task DeleteAsync(Guid id)
    {
        var category = await _context.Categories.FindAsync(id)
            ?? throw new Exception("Category not found");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
    }

    private static CategoryDto MapToDto(Category c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Slug = c.Slug,
        Icon = c.Icon,
        ParentId = c.ParentId,
        Children = c.Children?.Select(MapToDto).ToList() ?? []
    };
}