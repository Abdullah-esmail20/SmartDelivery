using MediatR;
using SmartDelivery.Application.DTOs;
using SmartDelivery.Domain.Interfaces;

namespace SmartDelivery.Application.Features.Orders.Queries;

public class GetOrderByIdHandler : IRequestHandler<GetOrderByIdQuery, OrderDto?>
{
    private readonly IOrderRepository _orderRepository;

    public GetOrderByIdHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<OrderDto?> Handle(GetOrderByIdQuery request,
                                        CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdAsync(request.OrderId);
        if (order is null) return null;

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