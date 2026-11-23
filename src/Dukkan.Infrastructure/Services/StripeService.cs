using Dukkan.Application.DTOs.Stripe;
using Dukkan.Application.Interfaces;
using Dukkan.Domain.Enums;
using Dukkan.Infrastructure.Persistence;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;

namespace Dukkan.Infrastructure.Services;

public class StripeService : IStripeService
{
    private readonly IConfiguration _config;
    private readonly DukkanDbContext _context;

    public StripeService(IConfiguration config, DukkanDbContext context)
    {
        _config = config;
        _context = context;
        StripeConfiguration.ApiKey = config["Stripe:SecretKey"];
    }

    public async Task<string> CreateCheckoutSessionAsync(
        Guid orderId,
        string orderNumber,
        decimal totalAmount,
        IEnumerable<StripeLineItemDto> items)
    {
        var frontendUrl = _config["Stripe:FrontendUrl"] ?? "http://localhost:5173";

        var lineItems = items.Select(i => new SessionLineItemOptions
        {
            PriceData = new SessionLineItemPriceDataOptions
            {
                Currency = "usd",
                UnitAmount = (long)(i.UnitPrice * 100),
                ProductData = new SessionLineItemPriceDataProductDataOptions
                {
                    Name = i.Name
                }
            },
            Quantity = i.Quantity
        }).ToList();

        var options = new SessionCreateOptions
        {
            LineItems = lineItems,
            Mode = "payment",
            SuccessUrl = $"{frontendUrl}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
            CancelUrl = $"{frontendUrl}/checkout/cancel",
            Metadata = new Dictionary<string, string>
            {
                ["orderId"] = orderId.ToString(),
                ["orderNumber"] = orderNumber
            }
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options);

        var order = await _context.Orders.FindAsync(orderId);
        if (order != null)
        {
            order.StripePaymentId = session.Id;
            await _context.SaveChangesAsync();
        }

        return session.Url;
    }

    public async Task HandleWebhookAsync(string json, string stripeSignature)
    {
        var webhookSecret = _config["Stripe:WebhookSecret"]!;

        Event stripeEvent;
        try
        {
            stripeEvent = EventUtility.ConstructEvent(json, stripeSignature, webhookSecret);
        }
        catch
        {
            throw new InvalidOperationException("Invalid Stripe webhook signature");
        }

        if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
        {
            var session = (Session)stripeEvent.Data.Object;

            if (session.Metadata.TryGetValue("orderId", out var orderIdStr) &&
                Guid.TryParse(orderIdStr, out var orderId))
            {
                var order = await _context.Orders.FindAsync(orderId);
                if (order != null && order.Status == OrderStatus.Pending)
                {
                    order.Status = OrderStatus.Paid;
                    order.StripePaymentId = session.PaymentIntentId ?? session.Id;
                    await _context.SaveChangesAsync();
                }
            }
        }
    }
}