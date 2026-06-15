using SmartDelivery.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartDelivery.Domain.Enums;

namespace SmartDelivery.Application.Factories
{

    
    public static class OrderFactory
    {
        public static Order CreateStandardOrder(
            string description,
            string pickupAddress,
            string deliveryAddress,
            Guid customerId)
        {
            // ✅ OOP: نستخدم Factory Method من داخل الـ Entity نفسه
            return Order.Create(description, pickupAddress, deliveryAddress, customerId);
        }

        public static Order CreateUrgentOrder(
            string description,
            string pickupAddress,
            string deliveryAddress,
            Guid customerId)
        {
            return Order.Create(
                $"[عاجل] {description}",
                pickupAddress,
                deliveryAddress,
                customerId);
        }

        public static Order CreateScheduledOrder(
            string description,
            string pickupAddress,
            string deliveryAddress,
            Guid customerId,
            DateTime scheduledAt)
        {
            return Order.Create(
                $"[مجدول: {scheduledAt:dd/MM/yyyy HH:mm}] {description}",
                pickupAddress,
                deliveryAddress,
                customerId);
        }
    }

}
