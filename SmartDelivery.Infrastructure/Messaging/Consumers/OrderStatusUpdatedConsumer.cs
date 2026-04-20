using MassTransit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartDelivery.Application.Messaging;
using SmartDelivery.Application.Services;

namespace SmartDelivery.Infrastructure.Messaging.Consumers;

// ✅ شرط 8 + شرط 10: ESB Consumer يرسل إشعار SignalR
// عند استقبال Event من RabbitMQ → أرسل فوراً عبر SignalR
public class OrderStatusUpdatedConsumer : IConsumer<OrderStatusUpdatedEvent>
{
    private readonly INotificationService _notificationService;

    public OrderStatusUpdatedConsumer(
        INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public async Task Consume(ConsumeContext<OrderStatusUpdatedEvent> context)
    {
        var statusEvent = context.Message;

        Console.WriteLine($"[ESB] تغيرت حالة الطلب {statusEvent.OrderId}");
        Console.WriteLine($"      من {statusEvent.OldStatus} إلى {statusEvent.NewStatus}");

        // ✅ بعد استقبال الـ Event من RabbitMQ
        // أرسل إشعاراً فورياً عبر SignalR لكل من يتابع الطلب
        await _notificationService.NotifyOrderStatusChangedAsync(
            statusEvent.OrderId,
            statusEvent.NewStatus);
    }
}