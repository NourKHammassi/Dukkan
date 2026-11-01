namespace Dukkan.Domain.Enums;

public enum OrderStatus
{
    Pending,
    Paid,
    Shipped,
    Delivered,
    RefundRequested,
    Refunded,
    Cancelled
}