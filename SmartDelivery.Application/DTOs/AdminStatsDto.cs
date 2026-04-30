using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.DTOs;

// ✅ إحصائيات لوحة التحكم
public class AdminStatsDto
{
    public int TotalOrders { get; set; }
    public int PendingOrders { get; set; }
    public int DeliveredOrders { get; set; }
    public int TotalCustomers { get; set; }
    public int TotalCouriers { get; set; }
    public int ActiveCouriers { get; set; }
}
