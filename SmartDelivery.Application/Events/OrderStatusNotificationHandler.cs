using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Events
{

    // ✅ Observer 1: يرسل إشعاراً للعميل عند تغيير الحالة
    public class OrderStatusNotificationHandler
        : IEventHandler<OrderStatusChangedEvent>
    {
        public async Task HandleAsync(OrderStatusChangedEvent eventData)
        {
            // في المشروع الحقيقي هنا نرسل إشعار عبر SignalR أو Email
            // سيُربط مع SignalR في الخطوة التالية
            Console.WriteLine($"[إشعار] الطلب {eventData.OrderId} " +
                              $"أصبح {eventData.NewStatus} " +
                              $"للعميل {eventData.CustomerId}");

            await Task.CompletedTask;
        }
    }
}
