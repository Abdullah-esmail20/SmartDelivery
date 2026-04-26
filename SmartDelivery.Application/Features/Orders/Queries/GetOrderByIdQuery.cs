using MediatR;
using SmartDelivery.Application.DTOs;

namespace SmartDelivery.Application.Features.Orders.Queries;

public record GetOrderByIdQuery(Guid OrderId) : IRequest<OrderDto?>;