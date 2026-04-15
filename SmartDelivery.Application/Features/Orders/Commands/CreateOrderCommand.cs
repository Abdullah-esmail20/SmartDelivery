using MediatR;
using SmartDelivery.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Features.Orders.Commands
{

    // هذا الـ Command يحمل البيانات المطلوبة لإنشاء طلب جديد
    public record CreateOrderCommand
        (
        string Description,
        string PickupAddress,
        string DeliveryAddress,
        Guid CustomerId
    ) : IRequest<OrderDto>;
}
