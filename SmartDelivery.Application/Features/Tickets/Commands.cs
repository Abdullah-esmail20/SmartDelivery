using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MediatR;
using SmartDelivery.Application.DTOs;

namespace SmartDelivery.Application.Features.Tickets.Commands;

public record CreateTicketCommand(
    string Subject,
    string Message,
    Guid CustomerId,
    Guid? OrderId
) : IRequest<TicketDto>;