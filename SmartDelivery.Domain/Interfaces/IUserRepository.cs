using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartDelivery.Domain.Entities;

namespace SmartDelivery.Domain.Interfaces
{


    public interface IUserRepository : IRepository<AppUser>
    {
        // البحث بالإيميل — لتسجيل الدخول
        Task<AppUser?> GetByEmailAsync(string email);

        // التحقق أن الإيميل غير مستخدم
        Task<bool> EmailExistsAsync(string email);
    }
}
