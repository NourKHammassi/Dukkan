using Dukkan.Application.DTOs.Review;

namespace Dukkan.Application.Interfaces;

public interface IReviewService
{
    Task<List<ReviewDto>> GetProductReviewsAsync(Guid productId);
    Task<ReviewDto> CreateAsync(Guid userId, CreateReviewDto dto);
    Task DeleteAsync(Guid userId, Guid reviewId);
}