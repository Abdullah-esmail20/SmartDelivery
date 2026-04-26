using MediatR;
using SmartDelivery.Application.DTOs;

namespace SmartDelivery.Application.Features.Orders.Queries;

// ✅ CQRS Query — جلب طلبات كورير معين
public record GetOrdersByCourierQuery(Guid CourierId)
    : IRequest<IEnumerable<OrderDto>>;