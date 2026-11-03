namespace Dukkan.Application.DTOs.Admin;

public class AdminStatsDto
{
    public int TotalUsers { get; set; }
    public int TotalSellers { get; set; }
    public int TotalStores { get; set; }
    public int PendingStores { get; set; }
    public int TotalProducts { get; set; }
    public int TotalOrders { get; set; }
    public int PendingOrders { get; set; }
    public decimal TotalRevenue { get; set; }
}