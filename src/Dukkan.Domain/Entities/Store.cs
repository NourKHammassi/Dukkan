namespace Dukkan.Domain.Entities;

public class Store
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Logo { get; set; }
    public string? Banner { get; set; }
    public bool IsApproved { get; set; } = false;
    public string? StripeAccountId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = null!;
    public ICollection<Product> Products { get; set; } = [];
}