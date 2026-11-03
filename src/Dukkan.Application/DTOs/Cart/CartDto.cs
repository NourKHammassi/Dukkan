namespace Dukkan.Application.DTOs.Cart;

public class CartDto
{
    public List<CartItemDto> Items { get; set; } = [];
    public decimal Total => Items.Sum(i => i.Subtotal);
    public int ItemCount => Items.Sum(i => i.Quantity);
}