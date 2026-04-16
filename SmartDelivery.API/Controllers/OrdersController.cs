using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartDelivery.Application.Features.Orders.Commands;
using SmartDelivery.Application.Features.Orders.Queries;

namespace SmartDelivery.API.Controllers;

// [ApiController] يفعّل ميزات تلقائية مثل التحقق من البيانات
[ApiController]
// الـ URL سيكون: https://localhost:xxxx/api/orders
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    // MediatR هو الوسيط بين الـ Controller والـ Handlers
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET: api/orders
    // جلب كل الطلبات
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // نرسل Query لـ MediatR ويوصلها للـ Handler المناسب
        var result = await _mediator.Send(new GetAllOrdersQuery());
        return Ok(result); // 200 OK مع البيانات
    }

    // POST: api/orders
    // إنشاء طلب جديد
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderCommand command)
    {
        // [FromBody] يعني البيانات تجي من الـ Request Body كـ JSON
        var result = await _mediator.Send(command);

        // 201 Created مع بيانات الطلب الجديد
        return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
    }
}