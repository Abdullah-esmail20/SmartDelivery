using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MediatR;
using SmartDelivery.Application.DTOs;

namespace SmartDelivery.Application.Features.Orders.Commands;

// ✅ CQRS Command — تعديل طلب موجود
public record UpdateOrderCommand(
    Guid OrderId,
    string Description,
    string PickupAddress,
    string DeliveryAddress
) : IRequest<OrderDto?>;
