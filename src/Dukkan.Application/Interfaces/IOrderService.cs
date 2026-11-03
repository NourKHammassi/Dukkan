using Dukkan.Application.DTOs.Order;

namespace Dukkan.Application.Interfaces;

public interface IOrderService
{
    Task<List<OrderDto>> GetMyOrdersAsync(Guid userId);
    Task<OrderDto> GetByIdAsync(Guid userId, Guid orderId);
    Task<List<OrderDto>> GetStoreOrdersAsync(Guid sellerId);
    Task<List<OrderDto>> GetAllOrdersAsync();
    Task<OrderDto> CreateFromCartAsync(Guid userId, CreateOrderDto dto);
    Task<OrderDto> UpdateStatusAsync(Guid orderId, UpdateOrderStatusDto dto);
    Task CancelAsync(Guid userId, Guid orderId);
}