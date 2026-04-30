using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartDelivery.Application.Features.Admin;
using SmartDelivery.Application.Features.Orders.Queries;
using SmartDelivery.Domain.Interfaces;

namespace SmartDelivery.API.Controllers;

// ✅ Admin Controller — للمدير فقط
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IUserRepository _userRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly ICourierRepository _courierRepository;

    public AdminController(
        IMediator mediator,
        IUserRepository userRepository,
        ICustomerRepository customerRepository,
        ICourierRepository courierRepository)
    {
        _mediator = mediator;
        _userRepository = userRepository;
        _customerRepository = customerRepository;
        _courierRepository = courierRepository;
    }

    // GET: api/admin/stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var result = await _mediator.Send(new GetAdminStatsQuery());
        return Ok(result);
    }

    // GET: api/admin/orders
    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders()
    {
        var result = await _mediator.Send(new GetAllOrdersQuery());
        return Ok(result);
    }

    // GET: api/admin/users
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userRepository.GetAllAsync();
        return Ok(users.Select(u => new
        {
            u.Id,
            u.FullName,
            u.Email,
            u.Role,
            u.CreatedAt,
            u.CustomerId,
            u.CourierId
        }));
    }

    // DELETE: api/admin/users/{userId}
    [HttpDelete("users/{userId}")]
    public async Task<IActionResult> DeleteUser(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null) return NotFound("المستخدم غير موجود");

        await _userRepository.DeleteAsync(userId);
        return Ok("تم حذف المستخدم بنجاح");
    }

    // PUT: api/admin/couriers/{courierId}/availability
    [HttpPut("couriers/{courierId}/availability")]
    public async Task<IActionResult> SetCourierAvailability(
        Guid courierId, [FromBody] bool isAvailable)
    {
        var courier = await _courierRepository.GetByIdAsync(courierId);
        if (courier is null) return NotFound("الكورير غير موجود");

        courier.SetAvailability(isAvailable);
        await _courierRepository.UpdateAsync(courier);
        return Ok("تم تحديث حالة الكورير");
    }
}