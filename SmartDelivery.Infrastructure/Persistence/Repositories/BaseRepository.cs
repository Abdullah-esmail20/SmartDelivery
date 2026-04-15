using SmartDelivery.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SmartDelivery.Infrastructure.Persistence;

namespace SmartDelivery.Infrastructure.Persistence.Repositories;

// BaseRepository ينفذ العمليات المشتركة لكل الكيانات
// T : class يعني أي كلاس نمرره مثل Order أو Courier
public class BaseRepository<T> : IRepository<T> where T : class
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public BaseRepository(AppDbContext context)
    {
        _context = context;
        // نحصل على الجدول المناسب تلقائياً حسب نوع T
        _dbSet = context.Set<T>();
    }

    // جلب عنصر واحد بالـ Id
    public async Task<T?> GetByIdAsync(Guid id)
    {
        return await _dbSet.FindAsync(id);
    }

    // جلب كل العناصر
    public async Task<IEnumerable<T>> GetAllAsync()
    {
        // AsNoTracking أسرع لأننا لا نريد تعديل البيانات
        return await _dbSet.AsNoTracking().ToListAsync();
    }

    // إضافة عنصر جديد
    public async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync(); // حفظ في DB
    }

    // تعديل عنصر موجود
    public async Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
    }

    // حذف عنصر بالـ Id
    public async Task DeleteAsync(Guid id)
    {
        var entity = await GetByIdAsync(id);
        if (entity is not null)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}