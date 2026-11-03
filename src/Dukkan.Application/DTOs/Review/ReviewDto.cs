namespace Dukkan.Application.DTOs.Review;

public class ReviewDto
{
    public Guid Id { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public Guid ProductId { get; set; }
    public DateTime CreatedAt { get; set; }
}