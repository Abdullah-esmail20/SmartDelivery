using SmartDelivery.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartDelivery.Domain.Entities;

namespace SmartDelivery.Domain.Interfaces
{
    //عمليات الكوريرز 

public interface ICourierRepository : IRepository<Courier>
{
    // جلب الكوريرز المتاحين فقط
    Task<IEnumerable<Courier>> GetAvailableCouriersAsync();
}
}