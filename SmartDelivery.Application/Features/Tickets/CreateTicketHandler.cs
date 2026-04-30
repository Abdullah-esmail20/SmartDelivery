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

public class CreateTicketHandler
    : IRequestHandler<CreateTicketCommand, TicketDto>
{
    private readonly ITicketRepository _ticketRepository;

    public CreateTicketHandler(ITicketRepository ticketRepository)
    {
        _ticketRepository = ticketRepository;
    }

    public async Task<TicketDto> Handle(
        CreateTicketCommand request,
        CancellationToken cancellationToken)
    {
        var ticket = Ticket.Create(
            request.Subject,
            request.Message,
            request.CustomerId,
            request.OrderId);

        await _ticketRepository.AddAsync(ticket);

        return new TicketDto
        {
            Id = ticket.Id,
            Subject = ticket.Subject,
            Message = ticket.Message,
            Status = ticket.Status,
            CreatedAt = ticket.CreatedAt,
            CustomerId = ticket.CustomerId,
            OrderId = ticket.OrderId,
            Replies = new()
        };
    }
}
