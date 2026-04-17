using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Events
{

    // هذا الـ Event يُطلق عند تغيير حالة الطلب
    public class OrderStatusChangedEvent
    {
        public Guid OrderId { get; set; }
        public string NewStatus { get; set; } = string.Empty;
        public Guid CustomerId { get; set; }
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    }
}
