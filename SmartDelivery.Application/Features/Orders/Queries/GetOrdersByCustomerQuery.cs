using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using SmartDelivery.Application.DTOs;

namespace SmartDelivery.Application.Features.Orders.Queries;

public record GetOrdersByCustomerQuery(Guid CustomerId)
    : IRequest<IEnumerable<OrderDto>>;
