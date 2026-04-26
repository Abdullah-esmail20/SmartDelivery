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

    // ✅ شرط 8: نضيف IPublishEndpoint لنشر Event على RabbitMQ
    private readonly IPublishEndpoint _publishEndpoint;

    public UpdateOrderStatusHandler(
        IOrderRepository orderRepository,
        IPublishEndpoint publishEndpoint)
    {
        _orderRepository = orderRepository;
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
        // RabbitMQ يوصله للـ Consumer الذي يرسله لـ SignalR
        await _publishEndpoint.Publish(new OrderStatusUpdatedEvent
        {
            OrderId = order.Id,
            CustomerId = order.CustomerId,
            OldStatus = oldStatus,
            NewStatus = request.NewStatus
        });

        return true;
    }
}