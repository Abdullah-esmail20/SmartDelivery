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

public class CustomerRepository : BaseRepository<Customer>, ICustomerRepository
{
    public CustomerRepository(AppDbContext context) : base(context) { }

    public async Task<Customer?> GetByEmailAsync(string email)
    {
        return await _context.Customers
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Email.ToLower() == email.ToLower());
    }
}