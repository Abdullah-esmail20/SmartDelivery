using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MediatR;
using SmartDelivery.Application.DTOs;
using SmartDelivery.Domain.Interfaces;

namespace SmartDelivery.Application.Features.Orders.Queries;

public class GetOrdersByCustomerHandler
    : IRequestHandler<GetOrdersByCustomerQuery, IEnumerable<OrderDto>>
{
    private readonly IOrderRepository _orderRepository;

    public GetOrdersByCustomerHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<IEnumerable<OrderDto>> Handle(
        GetOrdersByCustomerQuery request,
        CancellationToken cancellationToken)
    {
        var orders = await _orderRepository
            .GetByCustomerIdAsync(request.CustomerId);

        return orders.Select(order => new OrderDto
        {
            Id = order.Id,
            Description = order.Description,
            PickupAddress = order.PickupAddress,
            DeliveryAddress = order.DeliveryAddress,
            Status = order.Status.ToString(),
            CreatedAt = order.CreatedAt,
            CustomerId = order.CustomerId,
            CourierId = order.CourierId
        });
    }
}
