using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MediatR;
using SmartDelivery.Application.DTOs;
using SmartDelivery.Domain.Entities;
using SmartDelivery.Domain.Interfaces;

namespace SmartDelivery.Application.Features.Tickets.Commands;

public class ReplyToTicketHandler
    : IRequestHandler<ReplyToTicketCommand, TicketReplyDto>
{
    private readonly ITicketRepository _ticketRepository;

    public ReplyToTicketHandler(ITicketRepository ticketRepository)
    {
        _ticketRepository = ticketRepository;
    }

    public async Task<TicketReplyDto> Handle(
        ReplyToTicketCommand request,
        CancellationToken cancellationToken)
    {
        var ticket = await _ticketRepository
            .GetByIdWithRepliesAsync(request.TicketId);

        if (ticket is null)
            throw new Exception("Ticket not found");

        var reply = TicketReply.Create(
            request.Message,
            request.SenderRole,
            request.SenderName,
            request.TicketId);

        // ✅ إذا Admin رد — غيّر الحالة لـ InProgress
        if (request.SenderRole == "Admin" &&
            ticket.Status == "Open")
        {
            ticket.UpdateStatus("InProgress");
        }

        await _ticketRepository.UpdateAsync(ticket);

        return new TicketReplyDto
        {
            Id = reply.Id,
            Message = reply.Message,
            SenderRole = reply.SenderRole,
            SenderName = reply.SenderName,
            CreatedAt = reply.CreatedAt
        };
    }
}
