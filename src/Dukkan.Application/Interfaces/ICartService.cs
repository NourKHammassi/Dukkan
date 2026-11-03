using Dukkan.Application.DTOs.Cart;

namespace Dukkan.Application.Interfaces;

public interface ICartService
{
    Task<CartDto> GetCartAsync(Guid userId);
    Task<CartDto> AddToCartAsync(Guid userId, AddToCartDto dto);
    Task<CartDto> UpdateQuantityAsync(Guid userId, Guid productId, int quantity);
    Task<CartDto> RemoveItemAsync(Guid userId, Guid productId);
    Task ClearCartAsync(Guid userId);
}