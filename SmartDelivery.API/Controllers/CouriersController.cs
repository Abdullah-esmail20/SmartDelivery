using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartDelivery.Application.Features.Orders.Commands;
using SmartDelivery.Application.Features.Orders.Queries;
using SmartDelivery.Domain.Enums;

namespace SmartDelivery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CouriersController : ControllerBase
{
    private readonly IMediator _mediator;

    public CouriersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET: api/couriers/{courierId}/orders
    // جلب كل طلبات كورير معين
    [HttpGet("{courierId}/orders")]
    public async Task<IActionResult> GetCourierOrders(Guid courierId)
    {
        var result = await _mediator.Send(
            new GetOrdersByCourierQuery(courierId));
        return Ok(result);
    }

    // PUT: api/couriers/orders/{orderId}/status
    // تحديث حالة الطلب من قبل الكورير
    [HttpPut("orders/{orderId}/status")]
    public async Task<IActionResult> UpdateOrderStatus(
        Guid orderId, [FromBody] UpdateOrderStatusRequest request)
    {
        var result = await _mediator.Send(
            new UpdateOrderStatusCommand(orderId, request.NewStatus));

        if (!result) return NotFound("الطلب غير موجود");
        return Ok("تم تحديث الحالة بنجاح");
    }
}

// ✅ Request model بسيط
public record UpdateOrderStatusRequest(string NewStatus);