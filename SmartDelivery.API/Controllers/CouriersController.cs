using MediatR;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using SmartDelivery.Application.Features.Orders.Commands;
using SmartDelivery.Application.Features.Orders.Queries;
using SmartDelivery.Domain.Enums;
using SmartDelivery.Domain.Interfaces;  

namespace SmartDelivery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CouriersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICourierRepository _courierRepository;  

    public CouriersController(
        IMediator mediator,
        ICourierRepository courierRepository) 
    {
        _mediator = mediator;
        _courierRepository = courierRepository;  // ✅ أضف هذا
    }

    // GET: api/couriers/{courierId}/orders
    [HttpGet("{courierId}/orders")]
    public async Task<IActionResult> GetCourierOrders(Guid courierId)
    {
        var result = await _mediator.Send(
            new GetOrdersByCourierQuery(courierId));
        return Ok(result);
    }

    // PUT: api/couriers/orders/{orderId}/status
    [HttpPut("orders/{orderId}/status")]
    public async Task<IActionResult> UpdateOrderStatus(
        Guid orderId, [FromBody] UpdateOrderStatusRequest request)
    {
        var result = await _mediator.Send(
            new UpdateOrderStatusCommand(orderId, request.NewStatus));
        if (!result) return NotFound("الطلب غير موجود");
        return Ok("تم تحديث الحالة بنجاح");
    }

    // GET: api/couriers
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var couriers = await _courierRepository.GetAllAsync();
        return Ok(couriers.Select(c => new
        {
            c.Id,
            c.FullName,
            c.Phone,
            c.IsAvailable
        }));
    }
}

// ✅ Request model بسيط
public record UpdateOrderStatusRequest(string NewStatus);