namespace Dukkan.Application.DTOs.Product;

public class UpdateProductDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public int? Stock { get; set; }
    public string? SKU { get; set; }
    public List<string>? Images { get; set; }
    public Guid? CategoryId { get; set; }
    public bool? IsActive { get; set; }
}