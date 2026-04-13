using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Domain.Entities;

public class Customer
{
    public Guid Id { get; private set; }
    public string FullName { get; private set; }
    public string Email { get; private set; }
    public string Phone { get; private set; }
    public string Address { get; private set; }
    public DateTime CreatedAt { get; private set; }

    // Constructor خاص - لازم تستخدم Factory لإنشاء Customer
    private Customer() { }

    public static Customer Create(string fullName, string email,
                                   string phone, string address)
    {
        return new Customer
        {
            Id = Guid.NewGuid(),
            FullName = fullName,
            Email = email,
            Phone = phone,
            Address = address,
            CreatedAt = DateTime.UtcNow
        };
    }
}