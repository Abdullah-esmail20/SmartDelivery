using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Domain.Entities;

public class Ticket
{
    public Guid Id { get; private set; }
    public string Subject { get; private set; } = string.Empty;
    public string Message { get; private set; } = string.Empty;

    // ✅ حالة الشكوى
    public string Status { get; private set; } = "Open";

    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // ربط بالعميل والطلب
    public Guid CustomerId { get; private set; }
    public Guid? OrderId { get; private set; }

    // الردود
    public ICollection<TicketReply> Replies { get; private set; }
        = new List<TicketReply>();

    private Ticket() { }

    public static Ticket Create(
        string subject,
        string message,
        Guid customerId,
        Guid? orderId = null)
    {
        return new Ticket
        {
            Id = Guid.NewGuid(),
            Subject = subject,
            Message = message,
            Status = "Open",
            CustomerId = customerId,
            OrderId = orderId,
            CreatedAt = DateTime.UtcNow
        };
    }

    // ✅ تحديث الحالة
    public void UpdateStatus(string newStatus)
    {
        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
    }
}
