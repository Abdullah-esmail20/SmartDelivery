using MediatR;
using SmartDelivery.Application.DTOs;
using SmartDelivery.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Features.Orders.Queries
{
    public class GetAllOrdersHandler : IRequestHandler<GetAllOrdersQuery, IEnumerable<OrderDto>>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICourierRepository _courierRepository;  // ✅ أضفنا هذا

        public GetAllOrdersHandler(
            IOrderRepository orderRepository,
            ICourierRepository courierRepository)  // ✅ أضفنا هذا
        {
            _orderRepository = orderRepository;
            _courierRepository = courierRepository;  // ✅
        }

        public async Task<IEnumerable<OrderDto>> Handle(GetAllOrdersQuery request,
                                                         CancellationToken cancellationToken)
        {
            var orders = await _orderRepository.GetAllAsync();

            // ✅ نجلب كل الكوريرز مرة واحدة (للأداء)
            var couriers = await _courierRepository.GetAllAsync();

            return orders.Select(order => new OrderDto
            {
                Id = order.Id,
                Description = order.Description,
                PickupAddress = order.PickupAddress,
                DeliveryAddress = order.DeliveryAddress,
                Status = order.Status.ToString(),
                CreatedAt = order.CreatedAt,
                CustomerId = order.CustomerId,
                CourierId = order.CourierId,
                // ✅ نبحث عن اسم الكورير المطابق
                CourierName = order.CourierId.HasValue
                    ? couriers.FirstOrDefault(c => c.Id == order.CourierId.Value)?.FullName
                    : null
            });
        }
    }
}