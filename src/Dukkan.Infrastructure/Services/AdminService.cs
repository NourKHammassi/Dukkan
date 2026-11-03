using Dukkan.Application.DTOs.Admin;
using Dukkan.Application.DTOs.Store;
using Dukkan.Application.Interfaces;
using Dukkan.Domain.Enums;
using Dukkan.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Dukkan.Infrastructure.Services;

public class AdminService : IAdminService
{
    private readonly DukkanDbContext _context;

    public AdminService(DukkanDbContext context)
    {
        _context = context;
    }

    public async Task<AdminStatsDto> GetStatsAsync()
    {
        return new AdminStatsDto
        {
            TotalUsers = await _context.Users.CountAsync(),
            TotalSellers = await _context.Users.CountAsync(u => u.Role == UserRole.Seller),
            TotalStores = await _context.Stores.CountAsync(),
            PendingStores = await _context.Stores.CountAsync(s => !s.IsApproved),
            TotalProducts = await _context.Products.CountAsync(),
            TotalOrders = await _context.Orders.CountAsync(),
            PendingOrders = await _context.Orders.CountAsync(o => o.Status == OrderStatus.Pending),
            TotalRevenue = await _context.Orders
                .Where(o => o.Status == OrderStatus.Delivered)
                .SumAsync(o => o.TotalAmount)
        };
    }

    public async Task<List<AdminUserDto>> GetUsersAsync()
    {
        var users = await _context.Users
            .Include(u => u.Store)
            .Include(u => u.Orders)
            .ToListAsync();

        return users.Select(u => new AdminUserDto
        {
            Id = u.Id,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Email = u.Email,
            Role = u.Role.ToString(),
            IsActive = u.IsActive,
            StoreName = u.Store?.Name,
            OrderCount = u.Orders?.Count ?? 0,
            CreatedAt = u.CreatedAt
        }).ToList();
    }

    public async Task BanUserAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId)
            ?? throw new Exception("User not found");

        if (user.Role == UserRole.Admin)
            throw new Exception("Cannot ban an admin");

        user.IsActive = false;
        await _context.SaveChangesAsync();
    }

    public async Task UnbanUserAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId)
            ?? throw new Exception("User not found");

        user.IsActive = true;
        await _context.SaveChangesAsync();
    }

    public async Task<List<StoreDto>> GetPendingStoresAsync()
    {
        var stores = await _context.Stores
            .Include(s => s.Owner)
            .Where(s => !s.IsApproved)
            .ToListAsync();

        return stores.Select(s => new StoreDto
        {
            Id = s.Id,
            Name = s.Name,
            Slug = s.Slug,
            Description = s.Description,
            Logo = s.Logo,
            Banner = s.Banner,
            IsApproved = s.IsApproved,
            OwnerName = $"{s.Owner.FirstName} {s.Owner.LastName}",
            CreatedAt = s.CreatedAt
        }).ToList();
    }
}