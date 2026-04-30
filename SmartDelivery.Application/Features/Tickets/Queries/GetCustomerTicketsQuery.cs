using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using SmartDelivery.Application.DTOs;

namespace SmartDelivery.Application.Features.Tickets.Queries;

public record GetCustomerTicketsQuery(Guid CustomerId)
    : IRequest<IEnumerable<TicketDto>>;
