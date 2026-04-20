using MassTransit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



    // ✅ شرط 8: ESB Consumer
    // هذا الـ Consumer يستقبل الـ Event من RabbitMQ ويعالجه
    // يعمل تلقائياً في الخلفية بدون أي استدعاء مباشر

    // ✅ الآن نأخذ الـ Events من Application وليس Infrastructure
    using SmartDelivery.Application.Messaging;

    namespace SmartDelivery.Infrastructure.Messaging.Consumers;

    public class OrderCreatedConsumer : IConsumer<OrderCreatedEvent>
    {
        public async Task Consume(ConsumeContext<OrderCreatedEvent> context)
        {
            var orderEvent = context.Message;

            Console.WriteLine($"[ESB] طلب جديد وصل!");
            Console.WriteLine($"      OrderId  : {orderEvent.OrderId}");
            Console.WriteLine($"      العميل   : {orderEvent.CustomerId}");
            Console.WriteLine($"      من       : {orderEvent.PickupAddress}");
            Console.WriteLine($"      إلى      : {orderEvent.DeliveryAddress}");

            await Task.CompletedTask;
        }
    }
