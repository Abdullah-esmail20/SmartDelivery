using MediatR;
using SmartDelivery.Application.DTOs;
using SmartDelivery.Domain.Interfaces;

namespace SmartDelivery.Application.Features.Orders.Queries;

public class GetOrdersByCourierHandler
    : IRequestHandler<GetOrdersByCourierQuery, IEnumerable<OrderDto>>
{
    private readonly IOrderRepository _orderRepository;

    public GetOrdersByCourierHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<IEnumerable<OrderDto>> Handle(
        GetOrdersByCourierQuery request,
        CancellationToken cancellationToken)
    {
        var orders = await _orderRepository
            .GetByCourierIdAsync(request.CourierId);

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