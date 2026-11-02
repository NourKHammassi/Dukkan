namespace Dukkan.Application.DTOs.Store;

public class CreateStoreDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Logo { get; set; }
    public string? Banner { get; set; }
}