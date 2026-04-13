using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SmartDelivery.Domain.Enums;

public enum OrderStatus
{
    Pending,      // الطلب جديد - بانتظار تعيين كورير
    Assigned,     // تم تعيين كورير
    PickedUp,     // الكورير استلم الطلب
    InTransit,    // الطلب في الطريق
    Delivered,    // تم التسليم
    Cancelled     // ملغي
}
