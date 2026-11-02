using Dukkan.Application.DTOs.Store;
using Dukkan.Application.Interfaces;
using Dukkan.Domain.Entities;
using Dukkan.Domain.Enums;
using Dukkan.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Dukkan.Infrastructure.Services;

public class StoreService : IStoreService
{
    private readonly DukkanDbContext _context;

    public StoreService(DukkanDbContext context)
    {
        _context = context;
    }

    public async Task<StoreDto> GetMyStoreAsync(Guid userId)
    {
        var store = await _context.Stores
            .Include(s => s.Owner)
            .FirstOrDefaultAsync(s => s.OwnerId == userId)
            ?? throw new Exception("You don't have a store");

        return MapToDto(store);
    }

    public async Task<StoreDto> GetBySlugAsync(string slug)
    {
        var store = await _context.Stores
            .Include(s => s.Owner)
            .FirstOrDefaultAsync(s => s.Slug == slug && s.IsApproved)
            ?? throw new Exception("Store not found");

        return MapToDto(store);
    }

    public async Task<List<StoreDto>> GetAllAsync()
    {
        var stores = await _context.Stores
            .Include(s => s.Owner)
            .ToListAsync();

        return stores.Select(MapToDto).ToList();
    }

    public async Task<StoreDto> CreateAsync(Guid userId, CreateStoreDto dto)
    {
        if (await _context.Stores.AnyAsync(s => s.OwnerId == userId))
            throw new Exception("You already have a store");

        var user = await _context.Users.FindAsync(userId)
            ?? throw new Exception("User not found");

        var slug = dto.Name.ToLower().Replace(" ", "-");

        if (await _context.Stores.AnyAsync(s => s.Slug == slug))
            slug += "-" + Guid.NewGuid().ToString()[..4];

        var store = new Store
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Slug = slug,
            Description = dto.Description,
            Logo = dto.Logo,
            Banner = dto.Banner,
            OwnerId = userId,
            IsApproved = false
        };

        // Promote user to Seller
        user.Role = UserRole.Seller;

        _context.Stores.Add(store);
        await _context.SaveChangesAsync();

        return MapToDto(store);
    }

    public async Task<StoreDto> UpdateAsync(Guid userId, UpdateStoreDto dto)
    {
        var store = await _context.Stores
            .Include(s => s.Owner)
            .FirstOrDefaultAsync(s => s.OwnerId == userId)
            ?? throw new Exception("Store not found");

        if (dto.Name != null) store.Name = dto.Name;
        if (dto.Description != null) store.Description = dto.Description;
        if (dto.Logo != null) store.Logo = dto.Logo;
        if (dto.Banner != null) store.Banner = dto.Banner;

        await _context.SaveChangesAsync();

        return MapToDto(store);
    }

    public async Task ApproveAsync(Guid storeId)
    {
        var store = await _context.Stores.FindAsync(storeId)
            ?? throw new Exception("Store not found");

        store.IsApproved = true;
        await _context.SaveChangesAsync();
    }

    public async Task RejectAsync(Guid storeId)
    {
        var store = await _context.Stores.FindAsync(storeId)
            ?? throw new Exception("Store not found");

        store.IsApproved = false;
        await _context.SaveChangesAsync();
    }

    private static StoreDto MapToDto(Store s) => new()
    {
        Id = s.Id,
        Name = s.Name,
        Slug = s.Slug,
        Description = s.Description,
        Logo = s.Logo,
        Banner = s.Banner,
        IsApproved = s.IsApproved,
        OwnerName = s.Owner != null ? $"{s.Owner.FirstName} {s.Owner.LastName}" : string.Empty,
        CreatedAt = s.CreatedAt
    };
}