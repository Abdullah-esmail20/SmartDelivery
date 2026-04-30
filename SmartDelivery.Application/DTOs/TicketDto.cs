using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.DTOs;

public class TicketDto
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public Guid CustomerId { get; set; }
    public Guid? OrderId { get; set; }
    public List<TicketReplyDto> Replies { get; set; } = new();
}

public class TicketReplyDto
{
    public Guid Id { get; set; }
    public string Message { get; set; } = string.Empty;
    public string SenderRole { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
