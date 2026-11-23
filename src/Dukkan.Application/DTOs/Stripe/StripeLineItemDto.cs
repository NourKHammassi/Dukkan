namespace Dukkan.Application.DTOs.Stripe;

public record StripeLineItemDto(string Name, decimal UnitPrice, int Quantity);