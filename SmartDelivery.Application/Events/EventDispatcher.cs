using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Events
{

    // ✅ الـ Dispatcher يرسل الـ Event لكل المشتركين
    // هذا هو قلب الـ Observer Pattern
    public class EventDispatcher
    {
        // قائمة المشتركين — كل واحد ينتظر الـ Event
        private readonly List<IEventHandler<OrderStatusChangedEvent>> _handlers;

        public EventDispatcher(
            IEnumerable<IEventHandler<OrderStatusChangedEvent>> handlers)
        {
            _handlers = handlers.ToList();
        }

        // عند استدعاء هذه الدالة، كل المشتركين يُخطَرون
        public async Task DispatchAsync(OrderStatusChangedEvent eventData)
        {
            foreach (var handler in _handlers)
            {
                await handler.HandleAsync(eventData);
            }
        }
    }
}
