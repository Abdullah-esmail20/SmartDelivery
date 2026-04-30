using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SmartDelivery.Domain.Entities;

namespace SmartDelivery.Domain.Interfaces;

public interface ITicketRepository : IRepository<Ticket>
{
    // جلب شكاوي عميل معين مع الردود
    Task<IEnumerable<Ticket>> GetByCustomerIdAsync(Guid customerId);

    // جلب كل الشكاوي مع الردود (للأدمن)
    Task<IEnumerable<Ticket>> GetAllWithRepliesAsync();

    // جلب شكوى واحدة مع ردودها
    Task<Ticket?> GetByIdWithRepliesAsync(Guid ticketId);
}
