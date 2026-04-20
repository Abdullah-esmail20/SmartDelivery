using Microsoft.AspNetCore.SignalR;

namespace SmartDelivery.API.Hubs;

// ✅ شرط 10: Real-time Communication — SignalR Hub
// Hub هو نقطة الاتصال بين السيرفر والعملاء
// كل عميل متصل يحصل على connectionId فريد
public class DeliveryHub : Hub
{
    // عند اتصال عميل جديد
    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"[SignalR] عميل اتصل: {Context.ConnectionId}");
        await base.OnConnectedAsync();
    }

    // عند قطع الاتصال
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"[SignalR] عميل قطع الاتصال: {Context.ConnectionId}");
        await base.OnDisconnectedAsync(exception);
    }

    // ✅ العميل يشترك في متابعة طلب معين
    // مثل: العميل يفتح صفحة تتبع الطلب رقم X
    public async Task SubscribeToOrder(string orderId)
    {
        // نضيف العميل لـ Group خاص بهذا الطلب
        await Groups.AddToGroupAsync(Context.ConnectionId, $"order-{orderId}");
        Console.WriteLine($"[SignalR] عميل {Context.ConnectionId} يتابع الطلب {orderId}");
    }

    // ✅ الكورير يرسل موقعه الحالي للسيرفر
    public async Task UpdateCourierLocation(
        string orderId, double latitude, double longitude)
    {
        // السيرفر يعيد إرسال الموقع لكل من يتابع هذا الطلب
        await Clients.Group($"order-{orderId}")
            .SendAsync("CourierLocationUpdated", new
            {
                OrderId = orderId,
                Latitude = latitude,
                Longitude = longitude,
                UpdatedAt = DateTime.UtcNow
            });
    }
}