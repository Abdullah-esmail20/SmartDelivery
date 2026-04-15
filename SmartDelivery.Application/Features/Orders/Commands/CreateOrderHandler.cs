using MediatR;
using SmartDelivery.Application.DTOs;
using SmartDelivery.Domain.Entities;
using SmartDelivery.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Features.Orders.Commands
{
    public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, OrderDto>
    {
        private readonly IOrderRepository _orderRepository;

        public CreateOrderHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<OrderDto> Handle(CreateOrderCommand request,
                                           CancellationToken cancellationToken)
        {
            // Factory Method Pattern — من الخطوة 2
            var order = Order.Create(
                request.Description,
                request.PickupAddress,
                request.DeliveryAddress,
                request.CustomerId
            );

            await _orderRepository.AddAsync(order);

            return new OrderDto
            {
                Id = order.Id,
                Description = order.Description,
                PickupAddress = order.PickupAddress,
                DeliveryAddress = order.DeliveryAddress,
                Status = order.Status.ToString(),
                CreatedAt = order.CreatedAt,
                CustomerId = order.CustomerId
            };
        }
    }
}
