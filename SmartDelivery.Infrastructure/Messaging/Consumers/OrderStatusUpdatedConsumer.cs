using MassTransit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SmartDelivery.Application.Messaging;

namespace SmartDelivery.Infrastructure.Messaging.Consumers;

public class OrderStatusUpdatedConsumer : IConsumer<OrderStatusUpdatedEvent>
{
    public async Task Consume(ConsumeContext<OrderStatusUpdatedEvent> context)
    {
        var statusEvent = context.Message;

        Console.WriteLine($"[ESB] تغيرت حالة الطلب!");
        Console.WriteLine($"      OrderId  : {statusEvent.OrderId}");
        Console.WriteLine($"      من       : {statusEvent.OldStatus}");
        Console.WriteLine($"      إلى      : {statusEvent.NewStatus}");

        await Task.CompletedTask;
    }
}