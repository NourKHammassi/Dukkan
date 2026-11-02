using Dukkan.Application.DTOs.Product;

namespace Dukkan.Application.Interfaces;

public interface IProductService
{
    Task<PagedProductsDto> GetAllAsync(ProductFilterDto filter);
    Task<ProductDto> GetByIdAsync(Guid id);
    Task<ProductDto> CreateAsync(Guid sellerId, CreateProductDto dto);
    Task<ProductDto> UpdateAsync(Guid sellerId, Guid productId, UpdateProductDto dto);
    Task DeleteAsync(Guid sellerId, Guid productId);
}