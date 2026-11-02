using Dukkan.Application.DTOs.Store;

namespace Dukkan.Application.Interfaces;

public interface IStoreService
{
    Task<StoreDto> GetMyStoreAsync(Guid userId);
    Task<StoreDto> GetBySlugAsync(string slug);
    Task<List<StoreDto>> GetAllAsync();
    Task<StoreDto> CreateAsync(Guid userId, CreateStoreDto dto);
    Task<StoreDto> UpdateAsync(Guid userId, UpdateStoreDto dto);
    Task ApproveAsync(Guid storeId);
    Task RejectAsync(Guid storeId);
}