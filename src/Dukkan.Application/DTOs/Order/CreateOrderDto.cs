namespace Dukkan.Application.DTOs.Order;

public record CreateOrderDto(
    string ShippingAddress,
    List<OrderCartItemDto>? Items = null
);

public record OrderCartItemDto(Guid ProductId, int Quantity);