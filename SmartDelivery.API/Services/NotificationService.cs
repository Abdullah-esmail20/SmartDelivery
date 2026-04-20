using Microsoft.AspNetCore.SignalR;
using SmartDelivery.API.Hubs;
using SmartDelivery.Application.Services;

namespace SmartDelivery.API.Services;

// ✅ شرط 10: NotificationService في API لأنه يحتاج DeliveryHub
// API يعرف Hub ، Infrastructure لا يجب أن يعرفه
public class NotificationService : INotificationService
{
    private readonly IHubContext<DeliveryHub> _hubContext;

    public NotificationService(IHubContext<DeliveryHub> hubContext)
    {
        _hubContext = hubContext;
    }

    // ✅ إرسال تغيير الحالة لكل من يتابع الطلب
    public async Task NotifyOrderStatusChangedAsync(
        Guid orderId, string newStatus)
    {
        await _hubContext.Clients
            .Group($"order-{orderId}")
            .SendAsync("OrderStatusChanged", new
            {
                OrderId = orderId,
                NewStatus = newStatus,
                UpdatedAt = DateTime.UtcNow
            });

        Console.WriteLine(
            $"[SignalR] إشعار الطلب {orderId} → {newStatus}");
    }

    // ✅ إرسال إشعار لعميل معين
    public async Task NotifyCustomerAsync(Guid customerId, string message)
    {
        await _hubContext.Clients
            .Group($"customer-{customerId}")
            .SendAsync("CustomerNotification", new
            {
                CustomerId = customerId,
                Message = message,
                SentAt = DateTime.UtcNow
            });
    }

    // ✅ إرسال إشعار لكورير معين
    public async Task NotifyCourierAsync(Guid courierId, string message)
    {
        await _hubContext.Clients
            .Group($"courier-{courierId}")
            .SendAsync("CourierNotification", new
            {
                CourierId = courierId,
                Message = message,
                SentAt = DateTime.UtcNow
            });
    }
}