using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using global::SmartDelivery.Domain.Entities;
using global::SmartDelivery.Domain.Enums;



namespace SmartDelivery.Domain.Interfaces
{
   

    public interface IOrderRepository : IRepository<Order>       //عمليات الطلبا

    {
        // جلب كل طلبات عميل معين
        Task<IEnumerable<Order>> GetByCustomerIdAsync(Guid customerId);

        // جلب كل طلبات كورير معين
        Task<IEnumerable<Order>> GetByCourierIdAsync(Guid courierId);

        // جلب الطلبات حسب الحالة
        Task<IEnumerable<Order>> GetByStatusAsync(OrderStatus status);
    }


}
