using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartDelivery.Domain.Enums;

namespace SmartDelivery.Domain.Entities;

public class Order
{
    public Guid Id { get; private set; }
    public string Description { get; private set; }
    public string PickupAddress { get; private set; }
    public string DeliveryAddress { get; private set; }
    public OrderStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }

    // العلاقات
    public Guid CustomerId { get; private set; }
    public Customer Customer { get; private set; }

    public Guid? CourierId { get; private set; }   // null حتى يُعيَّن كورير
    public Courier? Courier { get; private set; }

    private Order() { }

    public static Order Create(string description, string pickupAddress,
                                string deliveryAddress, Guid customerId)
    {
        return new Order
        {
            Id = Guid.NewGuid(),
            Description = description,
            PickupAddress = pickupAddress,
            DeliveryAddress = deliveryAddress,
            Status = OrderStatus.Pending,
            CustomerId = customerId,
            CreatedAt = DateTime.UtcNow
        };
    }

    // تعيين كورير للطلب
    public void AssignCourier(Guid courierId)
    {
        CourierId = courierId;
        Status = OrderStatus.Assigned;
    }

    // تحديث حالة الطلب
    public void UpdateStatus(OrderStatus newStatus)
    {
        Status = newStatus;
    }
}
