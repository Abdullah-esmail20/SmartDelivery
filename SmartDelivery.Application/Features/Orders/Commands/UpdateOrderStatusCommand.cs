using MediatR;

namespace SmartDelivery.Application.Features.Orders.Commands;

// ✅ CQRS Command — تحديث حالة الطلب
public record UpdateOrderStatusCommand(
    Guid OrderId,
    string NewStatus
) : IRequest<bool>;