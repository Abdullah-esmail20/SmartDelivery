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

public class CourierRepository : BaseRepository<Courier>, ICourierRepository
{
    public CourierRepository(AppDbContext context) : base(context) { }

    // جلب الكوريرز المتاحين فقط — IsAvailable = true
    public async Task<IEnumerable<Courier>> GetAvailableCouriersAsync()
    {
        return await _context.Couriers
            .Where(c => c.IsAvailable == true)
            .AsNoTracking()
            .ToListAsync();
    }
}
