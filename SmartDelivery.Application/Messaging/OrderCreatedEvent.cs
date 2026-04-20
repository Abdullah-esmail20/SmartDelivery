using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Messaging;

// ✅ شرط 8: ESB Event — في Application لأن كلا الطبقتين تحتاجه
public record OrderCreatedEvent
{
    public Guid EventId { get; init; } = Guid.NewGuid();
    public Guid OrderId { get; init; }
    public Guid CustomerId { get; init; }
    public string Description { get; init; } = string.Empty;
    public string PickupAddress { get; init; } = string.Empty;
    public string DeliveryAddress { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}