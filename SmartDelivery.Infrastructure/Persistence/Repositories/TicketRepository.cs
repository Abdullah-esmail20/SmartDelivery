using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using SmartDelivery.Domain.Entities;
using SmartDelivery.Domain.Interfaces;
using SmartDelivery.Infrastructure.Persistence;

namespace SmartDelivery.Infrastructure.Persistence.Repositories;

public class TicketRepository : BaseRepository<Ticket>, ITicketRepository
{
    public TicketRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Ticket>> GetByCustomerIdAsync(
        Guid customerId)
    {
        return await _context.Tickets
            .Include(t => t.Replies)
            .Where(t => t.CustomerId == customerId)
            .OrderByDescending(t => t.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<Ticket>> GetAllWithRepliesAsync()
    {
        return await _context.Tickets
            .Include(t => t.Replies)
            .OrderByDescending(t => t.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Ticket?> GetByIdWithRepliesAsync(Guid ticketId)
    {
        return await _context.Tickets
            .Include(t => t.Replies)
            .FirstOrDefaultAsync(t => t.Id == ticketId);
    }
}
