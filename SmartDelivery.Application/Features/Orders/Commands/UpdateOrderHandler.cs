using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MediatR;
using SmartDelivery.Application.DTOs;
using SmartDelivery.Domain.Interfaces;

namespace SmartDelivery.Application.Features.Orders.Commands;

public class UpdateOrderHandler : IRequestHandler<UpdateOrderCommand, OrderDto?>
{
    private readonly IOrderRepository _orderRepository;

    public UpdateOrderHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OrderDto?> Handle(UpdateOrderCommand request,
                                        CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdAsync(request.OrderId);
        if (order is null) return null;

        // ✅ فقط الطلبات Pending يمكن تعديلها
        // ✅ يسمح بالتعديل للـ Pending و Assigned فقط
        if (order.Status.ToString() != "Pending" &&
            order.Status.ToString() != "Assigned")
        {
            return null;
        }

        order.UpdateDetails(
            request.Description,
            request.PickupAddress,
            request.DeliveryAddress);

        await _orderRepository.UpdateAsync(order);

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
}