using Dukkan.Application.DTOs.Review;
using Dukkan.Application.Interfaces;
using Dukkan.Domain.Entities;
using Dukkan.Domain.Enums;
using Dukkan.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Dukkan.Infrastructure.Services;

public class ReviewService : IReviewService
{
    private readonly DukkanDbContext _context;

    public ReviewService(DukkanDbContext context)
    {
        _context = context;
    }

    public async Task<List<ReviewDto>> GetProductReviewsAsync(Guid productId)
    {
        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return reviews.Select(MapToDto).ToList();
    }

    public async Task<ReviewDto> CreateAsync(Guid userId, CreateReviewDto dto)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
            throw new Exception("Rating must be between 1 and 5");

        // Must have a delivered order for this product
        var hasDeliveredOrder = await _context.Orders
            .Include(o => o.Items)
            .AnyAsync(o => o.BuyerId == userId
                && o.Status == OrderStatus.Delivered
                && o.Items.Any(i => i.ProductId == dto.ProductId));

        if (!hasDeliveredOrder)
            throw new Exception("You can only review products you have purchased and received");

        // One review per user per product
        if (await _context.Reviews.AnyAsync(r => r.UserId == userId && r.ProductId == dto.ProductId))
            throw new Exception("You have already reviewed this product");

        var review = new Review
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ProductId = dto.ProductId,
            OrderId = dto.OrderId,
            Rating = dto.Rating,
            Comment = dto.Comment
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.Id == review.Id)
            .Select(r => MapToDto(r))
            .FirstAsync();
    }

    public async Task DeleteAsync(Guid userId, Guid reviewId)
    {
        var review = await _context.Reviews.FindAsync(reviewId)
            ?? throw new Exception("Review not found");

        var user = await _context.Users.FindAsync(userId)
            ?? throw new Exception("User not found");

        if (review.UserId != userId && user.Role != UserRole.Admin)
            throw new Exception("Access denied");

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
    }

    private static ReviewDto MapToDto(Review r) => new()
    {
        Id = r.Id,
        Rating = r.Rating,
        Comment = r.Comment,
        UserName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : string.Empty,
        ProductId = r.ProductId,
        CreatedAt = r.CreatedAt
    };
}