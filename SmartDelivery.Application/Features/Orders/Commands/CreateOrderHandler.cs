using MediatR;
using SmartDelivery.Application.DTOs;
using SmartDelivery.Application.Factories;
using SmartDelivery.Application.Services;
using SmartDelivery.Domain.Interfaces;

namespace SmartDelivery.Application.Features.Orders.Commands;

public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, OrderDto>
{
    // ✅ نستخدم Facade بدل Repository مباشرة
    private readonly DeliveryFacade _deliveryFacade;

    public CreateOrderHandler(DeliveryFacade deliveryFacade)
    {
        _deliveryFacade = deliveryFacade;
    }

    public async Task<OrderDto> Handle(CreateOrderCommand request,
                                       CancellationToken cancellationToken)
    {
        // ✅ Facade يعيّن الكورير تلقائياً
        return await _deliveryFacade.PlaceOrderAsync(
            request.Description,
            request.PickupAddress,
            request.DeliveryAddress,
            request.CustomerId
        );
    }
}