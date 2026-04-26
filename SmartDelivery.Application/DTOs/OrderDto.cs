using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.DTOs
{
    public class OrderDto
    {
        public Guid Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public string PickupAddress { get; set; } = string.Empty;
        public string DeliveryAddress { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public Guid CustomerId { get; set; }
        public Guid? CourierId { get; set; }


        // ✅ اسم الكورير للعرض
        public string? CourierName { get; set; }

    }
}
