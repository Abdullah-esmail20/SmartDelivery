using MassTransit;
using SmartDelivery.Application.DTOs;
using SmartDelivery.Application.Factories;
// ✅ الآن صح — Application يأخذ Events من نفسه
using SmartDelivery.Application.Messaging;
using SmartDelivery.Domain.Enums;
using SmartDelivery.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Services;

// ✅ شرط 5: Facade — الآن مع ESB
public class DeliveryFacade
{
    private readonly IOrderRepository _orderRepository;
    private readonly ICourierRepository _courierRepository;

    // ✅ شرط 8: IPublishEndpoint يرسل Events لـ RabbitMQ
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

        // الخطوة 3: تعيين كورير متاح
        var availableCouriers = await _courierRepository.GetAvailableCouriersAsync();
        var courier = availableCouriers.FirstOrDefault();

        if (courier is not null)
        {
            order.AssignCourier(courier.Id);
            courier.SetAvailability(false);
            await _orderRepository.UpdateAsync(order);
            await _courierRepository.UpdateAsync(courier);
        }

        // ✅ شرط 8: نشر Event على RabbitMQ — كل المشتركين يستقبلونه
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
            CourierId = order.CourierId
        };
    }

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

        if (newStatus == OrderStatus.Delivered && order.CourierId.HasValue)
        {
            var courier = await _courierRepository.GetByIdAsync(
                order.CourierId.Value);

            if (courier is not null)
            {
                courier.SetAvailability(true);
                await _courierRepository.UpdateAsync(courier);
            }
        }

        return true;
    }
}