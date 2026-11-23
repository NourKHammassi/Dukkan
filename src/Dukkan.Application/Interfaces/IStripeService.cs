using Dukkan.Application.DTOs.Stripe;

namespace Dukkan.Application.Interfaces;

public interface IStripeService
{
    Task<string> CreateCheckoutSessionAsync(
        Guid orderId,
        string orderNumber,
        decimal totalAmount,
        IEnumerable<StripeLineItemDto> items);

    Task HandleWebhookAsync(string json, string stripeSignature);
}