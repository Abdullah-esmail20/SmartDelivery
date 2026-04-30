using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartDelivery.Application.Features.Tickets.Commands;
using SmartDelivery.Application.Features.Tickets.Queries;

namespace SmartDelivery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TicketsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // POST: api/tickets
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateTicketCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetCustomerTickets),
            new { customerId = result.CustomerId }, result);
    }

    // GET: api/tickets/customer/{customerId}
    [HttpGet("customer/{customerId}")]
    public async Task<IActionResult> GetCustomerTickets(Guid customerId)
    {
        var result = await _mediator.Send(
            new GetCustomerTicketsQuery(customerId));
        return Ok(result);
    }

    // GET: api/tickets/all
    [HttpGet("all")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllTicketsQuery());
        return Ok(result);
    }

    // POST: api/tickets/{ticketId}/reply
    [HttpPost("{ticketId}/reply")]
    public async Task<IActionResult> Reply(
        Guid ticketId,
        [FromBody] ReplyToTicketCommand command)
    {
        var updatedCommand = command with { TicketId = ticketId };
        var result = await _mediator.Send(updatedCommand);
        return Ok(result);
    }

    // PUT: api/tickets/{ticketId}/status
    [HttpPut("{ticketId}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid ticketId,
        [FromBody] string newStatus)
    {
        var result = await _mediator.Send(
            new UpdateTicketStatusCommand(ticketId, newStatus));

        if (!result) return NotFound();
        return Ok("تم تحديث حالة الشكوى");
    }
}
