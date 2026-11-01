using Dukkan.Domain.Enums;

namespace Dukkan.Domain.Entities;

public class Order
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public decimal TotalAmount { get; set; }
    public string? StripePaymentId { get; set; }
    public string? TrackingNumber { get; set; }
    public string ShippingAddress { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ShippedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }

    public Guid BuyerId { get; set; }
    public User Buyer { get; set; } = null!;
    public Guid StoreId { get; set; }
    public Store Store { get; set; } = null!;
    public ICollection<OrderItem> Items { get; set; } = [];
}