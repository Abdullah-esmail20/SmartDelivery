using MassTransit;
using SmartDelivery.Application.DTOs;
using SmartDelivery.Application.Factories;
using SmartDelivery.Application.Messaging;
using SmartDelivery.Domain.Enums;
using SmartDelivery.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Services;

// ✅ شرط 5: Facade — يبسّط عملية إنشاء الطلب وتعيين الكورير
public class DeliveryFacade
{
    private readonly IOrderRepository _orderRepository;
    private readonly ICourierRepository _courierRepository;
    private readonly IPublishEndpoint _publishEndpoint;

    public DeliveryFacade(
        IOrderRepository orderRepository,
        ICourierRepository courierRepository,
        IPublishEndpoint publishEndpoint)
    {
        _orderRepository = orderRepository;
        _courierRepository = courierRepository;
        _publishEndpoint = publishEndpoint;
    }

    // ════════════════════════════════════════
    // إنشاء طلب جديد + تعيين كورير تلقائياً
    // ════════════════════════════════════════
    public async Task<OrderDto> PlaceOrderAsync(
        string description,
        string pickupAddress,
        string deliveryAddress,
        Guid customerId,
        bool isUrgent = false)
    {
        // الخطوة 1: إنشاء الطلب عبر Factory
        var order = isUrgent
            ? OrderFactory.CreateUrgentOrder(
                description, pickupAddress, deliveryAddress, customerId)
            : OrderFactory.CreateStandardOrder(
                description, pickupAddress, deliveryAddress, customerId);

        // الخطوة 2: حفظ الطلب
        await _orderRepository.AddAsync(order);

        // الخطوة 3: تعيين كورير متاح (إن وُجد)
        var availableCouriers = await _courierRepository.GetAvailableCouriersAsync();
        var courier = availableCouriers.FirstOrDefault();

        string? infoMessage = null;  // ✅ رسالة معلوماتية

        if (courier is not null)
        {
            // ✅ يوجد كورير متاح — نعيّنه
            order.AssignCourier(courier.Id);
            courier.SetAvailability(false);
            await _orderRepository.UpdateAsync(order);
            await _courierRepository.UpdateAsync(courier);
        }
        else
        {
            // ✅ لا يوجد كورير متاح → الطلب يبقى Pending
            infoMessage = "Şu anda müsait kurye yok. Siparişiniz sıraya alındı, kurye müsait olunca otomatik atanacak.";
        }

        // ✅ شرط 8: نشر Event على RabbitMQ
        await _publishEndpoint.Publish(new OrderCreatedEvent
        {
            OrderId = order.Id,
            CustomerId = order.CustomerId,
            Description = order.Description,
            PickupAddress = order.PickupAddress,
            DeliveryAddress = order.DeliveryAddress
        });

        return new OrderDto
        {
            Id = order.Id,
            Description = order.Description,
            PickupAddress = order.PickupAddress,
            DeliveryAddress = order.DeliveryAddress,
            Status = order.Status.ToString(),
            CreatedAt = order.CreatedAt,
            CustomerId = order.CustomerId,
            CourierId = order.CourierId,
            InfoMessage = infoMessage  // ✅ نرجع الرسالة
        };
    }

    // ════════════════════════════════════════
    // تحديث حالة الطلب + إدارة طابور الانتظار
    // ════════════════════════════════════════
    public async Task<bool> UpdateOrderStatusAsync(
        Guid orderId, OrderStatus newStatus)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order is null) return false;

        var oldStatus = order.Status.ToString();
        order.UpdateStatus(newStatus);
        await _orderRepository.UpdateAsync(order);

        // ✅ شرط 8: نشر Event عند تغيير الحالة
        await _publishEndpoint.Publish(new OrderStatusUpdatedEvent
        {
            OrderId = order.Id,
            CustomerId = order.CustomerId,
            OldStatus = oldStatus,
            NewStatus = newStatus.ToString()
        });

        // ✅ عند التسليم — حرّر الكورير وأعطه طلباً منتظراً
        if (newStatus == OrderStatus.Delivered && order.CourierId.HasValue)
        {
            var courier = await _courierRepository.GetByIdAsync(
                order.CourierId.Value);

            if (courier is not null)
            {
                // الكورير صار متاحاً
                courier.SetAvailability(true);
                await _courierRepository.UpdateAsync(courier);

                // ✅ ابحث عن طلب منتظر (Pending) وعيّنه لهذا الكورير
                var pendingOrders = await _orderRepository
                    .GetByStatusAsync(OrderStatus.Pending);
                var waitingOrder = pendingOrders.FirstOrDefault();

                if (waitingOrder is not null)
                {
                    waitingOrder.AssignCourier(courier.Id);
                    courier.SetAvailability(false);  // يصير مشغولاً مجدداً

                    await _orderRepository.UpdateAsync(waitingOrder);
                    await _courierRepository.UpdateAsync(courier);

                    // ننشر حدث التعيين الجديد
                    await _publishEndpoint.Publish(new OrderStatusUpdatedEvent
                    {
                        OrderId = waitingOrder.Id,
                        CustomerId = waitingOrder.CustomerId,
                        OldStatus = "Pending",
                        NewStatus = "Assigned"
                    });
                }
            }
        }

        return true;
    }
}