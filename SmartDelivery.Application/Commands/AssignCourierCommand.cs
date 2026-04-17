using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartDelivery.Domain.Interfaces;

namespace SmartDelivery.Application.Commands;

// ✅ Command: تعيين كورير لطلب — يمكن التراجع عنه
public class AssignCourierCommand : IDeliveryCommand
{
    private readonly IOrderRepository _orderRepository;
    private readonly ICourierRepository _courierRepository;
    private readonly Guid _orderId;
    private readonly Guid _courierId;

    // نحفظ الحالة القديمة للتراجع
    private Guid? _previousCourierId;

    public AssignCourierCommand(
        IOrderRepository orderRepository,
        ICourierRepository courierRepository,
        Guid orderId,
        Guid courierId)
    {
        _orderRepository = orderRepository;
        _courierRepository = courierRepository;
        _orderId = orderId;
        _courierId = courierId;
    }

    // تنفيذ العملية
    public async Task ExecuteAsync()
    {
        var order = await _orderRepository.GetByIdAsync(_orderId);
        if (order is null) return;

        // نحفظ الكورير القديم للتراجع لاحقاً
        _previousCourierId = order.CourierId;

        order.AssignCourier(_courierId);
        await _orderRepository.UpdateAsync(order);

        var courier = await _courierRepository.GetByIdAsync(_courierId);
        if (courier is not null)
        {
            courier.SetAvailability(false);
            await _courierRepository.UpdateAsync(courier);
        }
    }

    // التراجع عن العملية — ✅ ميزة Command Pattern
    public async Task UndoAsync()
    {
        var order = await _orderRepository.GetByIdAsync(_orderId);
        if (order is null) return;

        // أعد الكورير الجديد للخدمة
        var newCourier = await _courierRepository.GetByIdAsync(_courierId);
        if (newCourier is not null)
        {
            newCourier.SetAvailability(true);
            await _courierRepository.UpdateAsync(newCourier);
        }

        // أعد الطلب للكورير القديم
        if (_previousCourierId.HasValue)
            order.AssignCourier(_previousCourierId.Value);

        await _orderRepository.UpdateAsync(order);
    }
}
