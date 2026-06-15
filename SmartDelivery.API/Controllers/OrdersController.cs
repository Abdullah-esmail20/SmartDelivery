using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartDelivery.Application.Features.Orders.Commands;
using SmartDelivery.Application.Features.Orders.Queries;

namespace SmartDelivery.API.Controllers;


[ApiController]

[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET: api/orders
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllOrdersQuery());
        return Ok(result); 
    }

    // POST: api/orders
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderCommand command)
    {
        // [FromBody]  Request Body ـ JSON
        var result = await _mediator.Send(command);

        // 201 Created 
        return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
    }


    // GET: api/orders/{orderId}
  
    [HttpGet("{orderId}")]
    public async Task<IActionResult> GetById(Guid orderId)
    {
        var result = await _mediator.Send(new GetOrderByIdQuery(orderId));
        if (result is null) return NotFound();
        return Ok(result);
    }

    // GET: api/orders/customer/{customerId}
    [HttpGet("customer/{customerId}")]
    public async Task<IActionResult> GetCustomerOrders(Guid customerId)
    {
        var result = await _mediator.Send(
            new GetOrdersByCustomerQuery(customerId));
        return Ok(result);
    }

    // PUT: api/orders/{orderId}
    [HttpPut("{orderId}")]
    public async Task<IActionResult> Update(
        Guid orderId,
        [FromBody] UpdateOrderCommand command)
    {        var updatedCommand = command with { OrderId = orderId };
        var result = await _mediator.Send(updatedCommand);

        if (result is null)
            return BadRequest("لا يمكن تعديل الطلب — يجب أن يكون Pending");

        return Ok(result);
    }
}