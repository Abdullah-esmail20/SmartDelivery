using MassTransit;
using MediatR;
using SmartDelivery.Application.Messaging;
using SmartDelivery.Domain.Enums;
using SmartDelivery.Domain.Interfaces;

namespace SmartDelivery.Application.Features.Orders.Commands;

public class UpdateOrderStatusHandler
    : IRequestHandler<UpdateOrderStatusCommand, bool>
{
    private readonly IOrderRepository _orderRepository;
    private readonly ICourierRepository _courierRepository;
    private readonly IPublishEndpoint _publishEndpoint;

    public UpdateOrderStatusHandler(
        IOrderRepository orderRepository,
        ICourierRepository courierRepository,
        IPublishEndpoint publishEndpoint)
    {
        _orderRepository = orderRepository;
        _courierRepository = courierRepository;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<bool> Handle(
        UpdateOrderStatusCommand request,
        CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdAsync(request.OrderId);
        if (order is null) return false;

        if (!Enum.TryParse<OrderStatus>(request.NewStatus, out var newStatus))
            return false;

        var oldStatus = order.Status.ToString();
        order.UpdateStatus(newStatus);
        await _orderRepository.UpdateAsync(order);

        // ✅ شرط 8 + 10: نشر Event على RabbitMQ
        await _publishEndpoint.Publish(new OrderStatusUpdatedEvent
        {
            OrderId = order.Id,
            CustomerId = order.CustomerId,
            OldStatus = oldStatus,
            NewStatus = request.NewStatus
        });

        // ✅ عند التسليم — حرّر الكورير وأعطه طلباً منتظراً
        // ✅ يتحرّر عند التسليم أو الإلغاء
        if ((newStatus == OrderStatus.Delivered ||
             newStatus == OrderStatus.Cancelled)
            && order.CourierId.HasValue)
        {
            var courier = await _courierRepository
                .GetByIdAsync(order.CourierId.Value);

            if (courier is not null)
            {
                courier.SetAvailability(true);
                await _courierRepository.UpdateAsync(courier);

                // ابحث عن طلب منتظر وعيّنه
                var pendingOrders = await _orderRepository
                    .GetByStatusAsync(OrderStatus.Pending);
                var waitingOrder = pendingOrders.FirstOrDefault();

                if (waitingOrder is not null)
                {
                    waitingOrder.AssignCourier(courier.Id);
                    courier.SetAvailability(false);
                    await _orderRepository.UpdateAsync(waitingOrder);
                    await _courierRepository.UpdateAsync(courier);

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