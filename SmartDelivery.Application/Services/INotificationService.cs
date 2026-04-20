using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Services;

// ✅ شرط 10: Interface للإشعارات الفورية
// Application يعرف ماذا يريد لكن لا يعرف كيف — Dependency Inversion
public interface INotificationService
{
    // إرسال إشعار لكل من يتابع طلباً معيناً
    Task NotifyOrderStatusChangedAsync(
        Guid orderId, string newStatus);

    // إرسال إشعار لعميل معين مباشرة
    Task NotifyCustomerAsync(
        Guid customerId, string message);

    // إرسال إشعار لكورير معين مباشرة
    Task NotifyCourierAsync(
        Guid courierId, string message);
}
