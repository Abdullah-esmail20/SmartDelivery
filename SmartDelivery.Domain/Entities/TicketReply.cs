using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Domain.Entities;

public class TicketReply
{
    public Guid Id { get; private set; }
    public string Message { get; private set; } = string.Empty;
    public string SenderRole { get; private set; } = string.Empty;
    public string SenderName { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }

    public Guid TicketId { get; private set; }
    public Ticket? Ticket { get; private set; }

    private TicketReply() { }

    public static TicketReply Create(
        string message,
        string senderRole,
        string senderName,
        Guid ticketId)
    {
        return new TicketReply
        {
            Id = Guid.NewGuid(),
            Message = message,
            SenderRole = senderRole,
            SenderName = senderName,
            TicketId = ticketId,
            CreatedAt = DateTime.UtcNow
        };
    }
}
