using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MediatR;
using SmartDelivery.Application.DTOs;
using SmartDelivery.Domain.Interfaces;

namespace SmartDelivery.Application.Features.Tickets.Queries;

public class GetAllTicketsHandler
    : IRequestHandler<GetAllTicketsQuery, IEnumerable<TicketDto>>
{
    private readonly ITicketRepository _ticketRepository;

    public GetAllTicketsHandler(ITicketRepository ticketRepository)
    {
        _ticketRepository = ticketRepository;
    }

    public async Task<IEnumerable<TicketDto>> Handle(
        GetAllTicketsQuery request,
        CancellationToken cancellationToken)
    {
        var tickets = await _ticketRepository.GetAllWithRepliesAsync();

        return tickets.Select(t => new TicketDto
        {
            Id = t.Id,
            Subject = t.Subject,
            Message = t.Message,
            Status = t.Status,
            CreatedAt = t.CreatedAt,
            CustomerId = t.CustomerId,
            OrderId = t.OrderId,
            Replies = t.Replies.Select(r => new TicketReplyDto
            {
                Id = r.Id,
                Message = r.Message,
                SenderRole = r.SenderRole,
                SenderName = r.SenderName,
                CreatedAt = r.CreatedAt
            }).ToList()
        });
    }
}
