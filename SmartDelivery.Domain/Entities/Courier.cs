using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SmartDelivery.Domain.Entities;

public class Courier
{
    public Guid Id { get; private set; }
    public string FullName { get; private set; }
    public string Phone { get; private set; }
    public bool IsAvailable { get; private set; }
    public double Latitude { get; private set; }   // موقع الكورير
    public double Longitude { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Courier() { }

    public static Courier Create(string fullName, string phone)
    {
        return new Courier
        {
            Id = Guid.NewGuid(),
            FullName = fullName,
            Phone = phone,
            IsAvailable = true,
            Latitude = 0,
            Longitude = 0,
            CreatedAt = DateTime.UtcNow
        };
    }

    // تحديث موقع الكورير  (سيُستخدم مع
    // SignalR لاحقاً)
    public void UpdateLocation(double latitude, double longitude)
    {
        Latitude = latitude;
        Longitude = longitude;
    }

    // تغيير حالة التوفر
    public void SetAvailability(bool isAvailable)
    {
        IsAvailable = isAvailable;
    }
}