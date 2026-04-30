using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MediatR;
using SmartDelivery.Application.DTOs;

namespace SmartDelivery.Application.Features.Tickets.Commands;

public record ReplyToTicketCommand(
    Guid TicketId,
    string Message,
    string SenderRole,
    string SenderName
) : IRequest<TicketReplyDto>;
