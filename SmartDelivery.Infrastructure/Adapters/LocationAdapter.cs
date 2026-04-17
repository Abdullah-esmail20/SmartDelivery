using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Infrastructure.Adapters;

// ✅ شرط 5 (ثاني واحد): Structural Design Pattern — Adapter
// Adapter يحول واجهة موجودة لواجهة أخرى يفهمها النظام
// مثال: خدمة خارجية تعطينا الموقع بصيغة مختلفة
// نحن نحولها لصيغتنا بدون تعديل الكود الأصلي

// هذا يمثل بيانات من خدمة خارجية (مثل Google Maps API)
// بصيغة مختلفة عن نظامنا
public class ExternalLocationData
{
    public double Lat { get; set; }  // اسم مختلف عن نظامنا
    public double Lng { get; set; }  // اسم مختلف عن نظامنا
    public string LocationName { get; set; } = string.Empty;
}

// صيغة الموقع التي يفهمها نظامنا
public class LocationModel
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Address { get; set; } = string.Empty;
}

// الـ Interface الذي يتوقعه نظامنا
public interface ILocationAdapter
{
    LocationModel Convert(ExternalLocationData externalData);
}

// ✅ OOP: الـ Adapter ينفذ الـ Interface ويحول البيانات
public class LocationAdapter : ILocationAdapter
{
    // نحول بيانات الخدمة الخارجية لصيغة نظامنا
    public LocationModel Convert(ExternalLocationData externalData)
    {
        return new LocationModel
        {
            // Lat → Latitude
            Latitude = externalData.Lat,
            // Lng → Longitude
            Longitude = externalData.Lng,
            // LocationName → Address
            Address = externalData.LocationName
        };
    }
}
