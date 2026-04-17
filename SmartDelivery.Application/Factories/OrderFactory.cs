using SmartDelivery.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartDelivery.Domain.Enums;

namespace SmartDelivery.Application.Factories
{

    // ✅ شرط 4: Creational Design Pattern — Factory Method
    // بدل ما ننشئ الطلب مباشرة بـ new، نستخدم Factory
    // الفائدة: لو تغير منطق الإنشاء، نعدل مكان واحد فقط
    public static class OrderFactory
    {
        // إنشاء طلب عادي
        public static Order CreateStandardOrder(
            string description,
            string pickupAddress,
            string deliveryAddress,
            Guid customerId)
        {
            // ✅ OOP: نستخدم Factory Method من داخل الـ Entity نفسه
            return Order.Create(description, pickupAddress, deliveryAddress, customerId);
        }

        // إنشاء طلب عاجل — نفس الطلب لكن بوصف خاص
        public static Order CreateUrgentOrder(
            string description,
            string pickupAddress,
            string deliveryAddress,
            Guid customerId)
        {
            // نضيف كلمة [عاجل] تلقائياً بدون ما يفكر فيها المستخدم
            return Order.Create(
                $"[عاجل] {description}",
                pickupAddress,
                deliveryAddress,
                customerId);
        }

        // إنشاء طلب مجدول لوقت معين
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
