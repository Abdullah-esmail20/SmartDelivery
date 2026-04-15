using MediatR;
using SmartDelivery.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Features.Orders.Queries
{

    // هذا الـ Query لا يغير أي شيء — فقط يجلب البيانات
    public record GetAllOrdersQuery() : IRequest<IEnumerable<OrderDto>>;
}
