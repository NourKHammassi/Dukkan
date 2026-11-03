using Dukkan.Application.DTOs.Order;
using Dukkan.Application.Interfaces;
using Dukkan.Domain.Entities;
using Dukkan.Domain.Enums;
using Dukkan.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Dukkan.Infrastructure.Services;

public class OrderService : IOrderService
{
    private readonly DukkanDbContext _context;

    public OrderService(DukkanDbContext context)
    {
        _context = context;
    }

    public async Task<List<OrderDto>> GetMyOrdersAsync(Guid userId)
    {
        var orders = await _context.Orders
            .Include(o => o.Items).ThenInclude(oi => oi.Product)
            .Include(o => o.Store)
            .Where(o => o.BuyerId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToDto).ToList();
    }

    public async Task<OrderDto> GetByIdAsync(Guid userId, Guid orderId)
    {
        var order = await _context.Orders
            .Include(o => o.Items).ThenInclude(oi => oi.Product)
            .Include(o => o.Store)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.BuyerId == userId)
            ?? throw new Exception("Order not found");

        return MapToDto(order);
    }

    public async Task<List<OrderDto>> GetStoreOrdersAsync(Guid sellerId)
    {
        var store = await _context.Stores.FirstOrDefaultAsync(s => s.OwnerId == sellerId)
            ?? throw new Exception("Store not found");

        var orders = await _context.Orders
            .Include(o => o.Items).ThenInclude(oi => oi.Product)
            .Include(o => o.Store)
            .Where(o => o.StoreId == store.Id)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToDto).ToList();
    }

    public async Task<List<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.Items).ThenInclude(oi => oi.Product)
            .Include(o => o.Store)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToDto).ToList();
    }

    public async Task<OrderDto> CreateFromCartAsync(Guid userId, CreateOrderDto dto)
    {
        var cartItems = await _context.CartItems
            .Include(ci => ci.Product).ThenInclude(p => p.Store)
            .Where(ci => ci.UserId == userId)
            .ToListAsync();

        if (cartItems.Count == 0)
            throw new Exception("Cart is empty");

        // Group by store — one order per store
        var byStore = cartItems.GroupBy(ci => ci.Product.StoreId);

        var createdOrders = new List<Order>();

        foreach (var group in byStore)
        {
            var storeId = group.Key;
            var items = group.ToList();

            var total = items.Sum(ci => ci.Product.Price * ci.Quantity);

            var order = new Order
            {
                Id = Guid.NewGuid(),
                OrderNumber = "DKN-" + DateTime.UtcNow.Ticks.ToString()[^8..],
                Status = OrderStatus.Pending,
                TotalAmount = total,
                ShippingAddress = dto.ShippingAddress,
                BuyerId = userId,
                StoreId = storeId,
                Items = items.Select(ci => new OrderItem
                {
                    Id = Guid.NewGuid(),
                    ProductId = ci.ProductId,
                    Quantity = ci.Quantity,
                    PriceAtPurchase = ci.Product.Price
                }).ToList()
            };

            // Deduct stock
            foreach (var ci in items)
            {
                ci.Product.Stock -= ci.Quantity;
            }

            _context.Orders.Add(order);
            createdOrders.Add(order);
        }

        // Clear cart
        _context.CartItems.RemoveRange(cartItems);
        await _context.SaveChangesAsync();

        // Return first order (multi-store orders return separately)
        return MapToDto(createdOrders.First());
    }

    public async Task<OrderDto> UpdateStatusAsync(Guid orderId, UpdateOrderStatusDto dto)
    {
        var order = await _context.Orders
            .Include(o => o.Items).ThenInclude(oi => oi.Product)
            .Include(o => o.Store)
            .FirstOrDefaultAsync(o => o.Id == orderId)
            ?? throw new Exception("Order not found");

        if (Enum.TryParse<OrderStatus>(dto.Status, true, out var status))
            order.Status = status;
        else
            throw new Exception("Invalid status");

        if (dto.TrackingNumber != null)
            order.TrackingNumber = dto.TrackingNumber;

        if (status == OrderStatus.Shipped)
            order.ShippedAt = DateTime.UtcNow;

        if (status == OrderStatus.Delivered)
            order.DeliveredAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapToDto(order);
    }

    public async Task CancelAsync(Guid userId, Guid orderId)
    {
        var order = await _context.Orders
            .Include(o => o.Items).ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.BuyerId == userId)
            ?? throw new Exception("Order not found");

        if (order.Status != OrderStatus.Pending)
            throw new Exception("Only pending orders can be cancelled");

        order.Status = OrderStatus.Cancelled;

        // Restore stock
        foreach (var item in order.Items)
        {
            item.Product.Stock += item.Quantity;
        }

        await _context.SaveChangesAsync();
    }

    private static OrderDto MapToDto(Order o) => new()
    {
        Id = o.Id,
        OrderNumber = o.OrderNumber,
        Status = o.Status.ToString(),
        TotalAmount = o.TotalAmount,
        ShippingAddress = o.ShippingAddress,
        TrackingNumber = o.TrackingNumber,
        StoreName = o.Store?.Name ?? string.Empty,
        Items = o.Items?.Select(oi => new OrderItemDto
        {
            Id = oi.Id,
            ProductId = oi.ProductId,
            ProductName = oi.Product?.Name ?? string.Empty,
            ProductSlug = oi.Product?.Slug ?? string.Empty,
            PriceAtPurchase = oi.PriceAtPurchase,
            Quantity = oi.Quantity
        }).ToList() ?? [],
        CreatedAt = o.CreatedAt,
        ShippedAt = o.ShippedAt,
        DeliveredAt = o.DeliveredAt
    };
}