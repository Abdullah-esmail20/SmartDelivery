using System;

namespace SmartDelivery.Domain.Entities
{
    public class AppUser
    {
        public Guid Id { get; private set; }
        public string FullName { get; private set; } = string.Empty;
        public string Email { get; private set; } = string.Empty;
        public string PasswordHash { get; private set; } = string.Empty;
        public string Role { get; private set; } = string.Empty;
        public DateTime CreatedAt { get; private set; }
        public Guid? CustomerId { get; private set; }
        public Guid? CourierId { get; private set; }

        private AppUser() { }

        // ✅ أضفنا fullName كأول parameter
        public static AppUser Create(
            string fullName,
            string email,
            string passwordHash,
            string role,
            Guid? customerId = null,
            Guid? courierId = null)
        {
            return new AppUser
            {
                Id = Guid.NewGuid(),
                FullName = fullName,      // ✅
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