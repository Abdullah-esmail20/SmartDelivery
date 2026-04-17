using SmartDelivery.Application.DTOs;
using SmartDelivery.Application.Factories;
using SmartDelivery.Domain.Enums;
using SmartDelivery.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Services
{




// ✅ شرط 5 (أول واحد): Structural Design Pattern — Facade
// Facade يوفر واجهة بسيطة للعمليات المعقدة
// بدل ما الـ Controller يتعامل مع Repository و Factory و منطق معقد
// يتعامل فقط مع DeliveryFacade بدالة واحدة
public class DeliveryFacade
{
    private readonly IOrderRepository _orderRepository;
    private readonly ICourierRepository _courierRepository;

    public DeliveryFacade(
        IOrderRepository orderRepository,
        ICourierRepository courierRepository)
    {
        _orderRepository = orderRepository;
        _courierRepository = courierRepository;
    }

    // ✅ OOP: Encapsulation — نخفي التعقيد داخل هذه الدالة
    // الـ Controller يستدعي دالة واحدة فقط بدل 5 خطوات
    public async Task<OrderDto> PlaceOrderAsync(
        string description,
        string pickupAddress,
        string deliveryAddress,
        Guid customerId,
        bool isUrgent = false)
    {
        // الخطوة 1: إنشاء الطلب عبر Factory
        var order = isUrgent
            ? OrderFactory.CreateUrgentOrder(description, pickupAddress, deliveryAddress, customerId)
            : OrderFactory.CreateStandardOrder(description, pickupAddress, deliveryAddress, customerId);

        // الخطوة 2: حفظ الطلب
        await _orderRepository.AddAsync(order);

        // الخطوة 3: ابحث عن كورير متاح وعيّنه تلقائياً
        var availableCouriers = await _courierRepository.GetAvailableCouriersAsync();
        var courier = availableCouriers.FirstOrDefault();

        if (courier is not null)
        {
            order.AssignCourier(courier.Id);
            courier.SetAvailability(false); // الكورير أصبح مشغولاً
            await _orderRepository.UpdateAsync(order);
            await _courierRepository.UpdateAsync(courier);
        }

        // الخطوة 4: إرجاع النتيجة
        return new OrderDto
        {
            Id = order.Id,
            Description = order.Description,
            PickupAddress = order.PickupAddress,
            DeliveryAddress = order.DeliveryAddress,
            Status = order.Status.ToString(),
            CreatedAt = order.CreatedAt,
            CustomerId = order.CustomerId,
            CourierId = order.CourierId
        };
    }

    // تحديث حالة الطلب بشكل مبسط
    public async Task<bool> UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);

        if (order is null) return false;

        order.UpdateStatus(newStatus);
        await _orderRepository.UpdateAsync(order);

        // إذا تم التسليم، أعد الكورير للخدمة
        if (newStatus == OrderStatus.Delivered && order.CourierId.HasValue)
        {
            var courier = await _courierRepository.GetByIdAsync(order.CourierId.Value);
            if (courier is not null)
            {
                courier.SetAvailability(true);
                await _courierRepository.UpdateAsync(courier);
            }
        }

        return true;
    }
    }
}