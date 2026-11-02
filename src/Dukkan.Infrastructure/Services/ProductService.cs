using Dukkan.Application.DTOs.Product;
using Dukkan.Application.Interfaces;
using Dukkan.Domain.Entities;
using Dukkan.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Dukkan.Infrastructure.Services;

public class ProductService : IProductService
{
    private readonly DukkanDbContext _context;

    public ProductService(DukkanDbContext context)
    {
        _context = context;
    }

    public async Task<PagedProductsDto> GetAllAsync(ProductFilterDto filter)
    {
        var query = _context.Products
            .Include(p => p.Store)
            .Include(p => p.Category)
            .Include(p => p.Reviews)
            .Where(p => p.IsActive)
            .AsQueryable();

        if (!string.IsNullOrEmpty(filter.Search))
            query = query.Where(p => p.Name.ToLower().Contains(filter.Search.ToLower()));

        if (filter.CategoryId.HasValue)
            query = query.Where(p => p.CategoryId == filter.CategoryId);

        if (filter.StoreId.HasValue)
            query = query.Where(p => p.StoreId == filter.StoreId);

        if (filter.MinPrice.HasValue)
            query = query.Where(p => p.Price >= filter.MinPrice);

        if (filter.MaxPrice.HasValue)
            query = query.Where(p => p.Price <= filter.MaxPrice);

        var totalCount = await query.CountAsync();

        var products = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return new PagedProductsDto
        {
            Items = products.Select(MapToDto).ToList(),
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<ProductDto> GetByIdAsync(Guid id)
    {
        var product = await _context.Products
            .Include(p => p.Store)
            .Include(p => p.Category)
            .Include(p => p.Reviews)
            .FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new Exception("Product not found");

        return MapToDto(product);
    }

    public async Task<ProductDto> CreateAsync(Guid sellerId, CreateProductDto dto)
    {
        var store = await _context.Stores
            .FirstOrDefaultAsync(s => s.OwnerId == sellerId && s.IsApproved)
            ?? throw new Exception("You don't have an approved store");

        var slug = dto.Name.ToLower().Replace(" ", "-") + "-" + Guid.NewGuid().ToString()[..6];

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Slug = slug,
            Description = dto.Description,
            Price = dto.Price,
            CompareAtPrice = dto.CompareAtPrice,
            Stock = dto.Stock,
            SKU = dto.SKU,
            Images = dto.Images,
            CategoryId = dto.CategoryId,
            StoreId = store.Id
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(product.Id);
    }

    public async Task<ProductDto> UpdateAsync(Guid sellerId, Guid productId, UpdateProductDto dto)
    {
        var product = await _context.Products
            .Include(p => p.Store)
            .FirstOrDefaultAsync(p => p.Id == productId && p.Store.OwnerId == sellerId)
            ?? throw new Exception("Product not found or access denied");

        if (dto.Name != null) product.Name = dto.Name;
        if (dto.Description != null) product.Description = dto.Description;
        if (dto.Price.HasValue) product.Price = dto.Price.Value;
        if (dto.CompareAtPrice.HasValue) product.CompareAtPrice = dto.CompareAtPrice;
        if (dto.Stock.HasValue) product.Stock = dto.Stock.Value;
        if (dto.SKU != null) product.SKU = dto.SKU;
        if (dto.Images != null) product.Images = dto.Images;
        if (dto.CategoryId.HasValue) product.CategoryId = dto.CategoryId.Value;
        if (dto.IsActive.HasValue) product.IsActive = dto.IsActive.Value;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(product.Id);
    }

    public async Task DeleteAsync(Guid sellerId, Guid productId)
    {
        var product = await _context.Products
            .Include(p => p.Store)
            .FirstOrDefaultAsync(p => p.Id == productId && p.Store.OwnerId == sellerId)
            ?? throw new Exception("Product not found or access denied");

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
    }

    private static ProductDto MapToDto(Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Slug = p.Slug,
        Description = p.Description,
        Price = p.Price,
        CompareAtPrice = p.CompareAtPrice,
        Stock = p.Stock,
        SKU = p.SKU,
        Images = p.Images,
        IsActive = p.IsActive,
        StoreId = p.StoreId,
        StoreName = p.Store?.Name ?? string.Empty,
        CategoryId = p.CategoryId,
        CategoryName = p.Category?.Name ?? string.Empty,
        AvgRating = p.Reviews?.Count > 0
            ? p.Reviews.Average(r => r.Rating)
            : null,
        ReviewCount = p.Reviews?.Count ?? 0,
        CreatedAt = p.CreatedAt
    };
}