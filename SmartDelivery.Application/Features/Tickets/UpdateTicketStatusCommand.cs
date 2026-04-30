using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MediatR;


namespace SmartDelivery.Application.Features.Tickets.Commands;

public record UpdateTicketStatusCommand(
    Guid TicketId,
    string NewStatus
) : IRequest<bool>;
