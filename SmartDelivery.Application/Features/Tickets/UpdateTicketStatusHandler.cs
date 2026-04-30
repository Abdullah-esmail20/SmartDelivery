using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MediatR;
using SmartDelivery.Domain.Interfaces;

namespace SmartDelivery.Application.Features.Tickets.Commands;

public class UpdateTicketStatusHandler
    : IRequestHandler<UpdateTicketStatusCommand, bool>
{
    private readonly ITicketRepository _ticketRepository;

    public UpdateTicketStatusHandler(ITicketRepository ticketRepository)
    {
        _ticketRepository = ticketRepository;
    }

    public async Task<bool> Handle(
        UpdateTicketStatusCommand request,
        CancellationToken cancellationToken)
    {
        var ticket = await _ticketRepository
            .GetByIdAsync(request.TicketId);

        if (ticket is null) return false;

        ticket.UpdateStatus(request.NewStatus);
        await _ticketRepository.UpdateAsync(ticket);
        return true;
    }
}
