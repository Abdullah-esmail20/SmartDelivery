using SmartDelivery.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Domain.Interfaces
{
    //عمليات العملاء
public interface ICustomerRepository : IRepository<Customer>
{
    // البحث عن عميل بالإيميل
    Task<Customer?> GetByEmailAsync(string email);
}
}