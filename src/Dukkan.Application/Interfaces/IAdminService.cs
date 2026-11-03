using Dukkan.Application.DTOs.Admin;
using Dukkan.Application.DTOs.Store;

namespace Dukkan.Application.Interfaces;

public interface IAdminService
{
    Task<AdminStatsDto> GetStatsAsync();
    Task<List<AdminUserDto>> GetUsersAsync();
    Task BanUserAsync(Guid userId);
    Task UnbanUserAsync(Guid userId);
    Task<List<StoreDto>> GetPendingStoresAsync();
}