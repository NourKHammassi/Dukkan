namespace Dukkan.Application.DTOs.Product;

public class ProductFilterDto
{
    public string? Search { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? StoreId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}