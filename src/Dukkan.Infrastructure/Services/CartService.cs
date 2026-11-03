using Dukkan.Application.DTOs.Cart;
using Dukkan.Application.Interfaces;
using Dukkan.Domain.Entities;
using Dukkan.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Dukkan.Infrastructure.Services;

public class CartService : ICartService
{
    private readonly DukkanDbContext _context;

    public CartService(DukkanDbContext context)
    {
        _context = context;
    }

    public async Task<CartDto> GetCartAsync(Guid userId)
    {
        var items = await _context.CartItems
            .Include(ci => ci.Product)
            .Where(ci => ci.UserId == userId)
            .ToListAsync();

        return MapToDto(items);
    }

    public async Task<CartDto> AddToCartAsync(Guid userId, AddToCartDto dto)
    {
        var product = await _context.Products.FindAsync(dto.ProductId)
            ?? throw new Exception("Product not found");

        if (!product.IsActive)
            throw new Exception("Product is not available");

        if (product.Stock < dto.Quantity)
            throw new Exception("Insufficient stock");

        // Get or create cart
        var cart = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == userId);
        if (cart == null)
        {
            cart = new Cart { Id = Guid.NewGuid(), UserId = userId };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        var existing = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == dto.ProductId);

        if (existing != null)
        {
            existing.Quantity += dto.Quantity;
        }
        else
        {
            var cartItem = new CartItem
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                CartId = cart.Id
            };
            _context.CartItems.Add(cartItem);
        }

        await _context.SaveChangesAsync();
        return await GetCartAsync(userId);
    }

    public async Task<CartDto> UpdateQuantityAsync(Guid userId, Guid productId, int quantity)
    {
        var item = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId)
            ?? throw new Exception("Item not in cart");

        if (quantity <= 0)
        {
            _context.CartItems.Remove(item);
        }
        else
        {
            var product = await _context.Products.FindAsync(productId);
            if (product != null && product.Stock < quantity)
                throw new Exception("Insufficient stock");

            item.Quantity = quantity;
        }

        await _context.SaveChangesAsync();
        return await GetCartAsync(userId);
    }

    public async Task<CartDto> RemoveItemAsync(Guid userId, Guid productId)
    {
        var item = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId)
            ?? throw new Exception("Item not in cart");

        _context.CartItems.Remove(item);
        await _context.SaveChangesAsync();
        return await GetCartAsync(userId);
    }

    public async Task ClearCartAsync(Guid userId)
    {
        var items = await _context.CartItems
            .Where(ci => ci.UserId == userId)
            .ToListAsync();

        _context.CartItems.RemoveRange(items);
        await _context.SaveChangesAsync();
    }

    private static CartDto MapToDto(List<CartItem> items) => new()
    {
        Items = items.Select(ci => new CartItemDto
        {
            Id = ci.Id,
            ProductId = ci.ProductId,
            ProductName = ci.Product?.Name ?? string.Empty,
            ProductSlug = ci.Product?.Slug ?? string.Empty,
            Price = ci.Product?.Price ?? 0,
            Images = ci.Product?.Images ?? [],
            Quantity = ci.Quantity,
            AvailableStock = ci.Product?.Stock ?? 0
        }).ToList()
    };
}