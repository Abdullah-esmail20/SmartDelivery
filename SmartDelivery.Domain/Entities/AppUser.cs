using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Domain.Entities
{

    public class AppUser
    {
        public Guid Id { get; private set; }
        public string Email { get; private set; } = string.Empty;

        // كلمة المرور محفوظة كـ Hash وليس نص عادي — أمان
        public string PasswordHash { get; private set; } = string.Empty;

        public string Role { get; private set; } = string.Empty; // "Customer" أو "Courier"
        public DateTime CreatedAt { get; private set; }

        // ربط المستخدم بالعميل أو الكورير
        public Guid? CustomerId { get; private set; }
        public Guid? CourierId { get; private set; }

        private AppUser() { }

        public static AppUser Create(string email, string passwordHash,
                                      string role, Guid? customerId = null,
                                      Guid? courierId = null)
        {
            return new AppUser
            {
                Id = Guid.NewGuid(),
                Email = email.ToLower(),
                PasswordHash = passwordHash,
                Role = role,
                CustomerId = customerId,
                CourierId = courierId,
                CreatedAt = DateTime.UtcNow
            };
        }

        // تغيير كلمة المرور
        public void ChangePassword(string newPasswordHash)
        {
            PasswordHash = newPasswordHash;
        }
    }
}
