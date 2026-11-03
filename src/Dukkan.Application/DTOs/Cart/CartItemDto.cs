namespace Dukkan.Application.DTOs.Cart;

public class CartItemDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductSlug { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public List<string> Images { get; set; } = [];
    public int Quantity { get; set; }
    public decimal Subtotal => Price * Quantity;
    public int AvailableStock { get; set; }
}