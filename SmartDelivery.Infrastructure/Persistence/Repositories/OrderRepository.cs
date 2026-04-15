using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartDelivery.Domain.Entities;
using SmartDelivery.Domain.Enums;
using SmartDelivery.Domain.Interfaces;
using SmartDelivery.Infrastructure.Persistence;

namespace SmartDelivery.Infrastructure.Persistence.Repositories;

// OrderRepository يرث من BaseRepository ويضيف عمليات خاصة بالطلبات
public class OrderRepository : BaseRepository<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext context) : base(context) { }

    // جلب طلبات عميل معين مع بيانات الكورير (Include = JOIN)
    public async Task<IEnumerable<Order>> GetByCustomerIdAsync(Guid customerId)
    {
        return await _context.Orders
            .Include(o => o.Courier)   // نجلب بيانات الكورير معها
            .Where(o => o.CustomerId == customerId)
            .AsNoTracking()
            .ToListAsync();
    }

    // جلب طلبات كورير معين
    public async Task<IEnumerable<Order>> GetByCourierIdAsync(Guid courierId)
    {
        return await _context.Orders
            .Include(o => o.Customer)  // نجلب بيانات العميل معها
            .Where(o => o.CourierId == courierId)
            .AsNoTracking()
            .ToListAsync();
    }

    // جلب الطلبات حسب حالتها مثل Pending أو Delivered
    public async Task<IEnumerable<Order>> GetByStatusAsync(OrderStatus status)
    {
        return await _context.Orders
            .Where(o => o.Status == status)
            .AsNoTracking()
            .ToListAsync();
    }
}
