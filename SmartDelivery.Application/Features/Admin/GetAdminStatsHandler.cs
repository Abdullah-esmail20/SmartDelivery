using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MediatR;
using SmartDelivery.Application.DTOs;
using SmartDelivery.Domain.Enums;
using SmartDelivery.Domain.Interfaces;

namespace SmartDelivery.Application.Features.Admin;

public class GetAdminStatsHandler
    : IRequestHandler<GetAdminStatsQuery, AdminStatsDto>
{
    private readonly IOrderRepository _orderRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly ICourierRepository _courierRepository;

    public GetAdminStatsHandler(
        IOrderRepository orderRepository,
        ICustomerRepository customerRepository,
        ICourierRepository courierRepository)
    {
        _orderRepository = orderRepository;
        _customerRepository = customerRepository;
        _courierRepository = courierRepository;
    }

    public async Task<AdminStatsDto> Handle(
        GetAdminStatsQuery request,
        CancellationToken cancellationToken)
    {
        var orders = await _orderRepository.GetAllAsync();
        var customers = await _customerRepository.GetAllAsync();
        var couriers = await _courierRepository.GetAllAsync();

        return new AdminStatsDto
        {
            TotalOrders = orders.Count(),
            PendingOrders = orders.Count(o =>
                o.Status == OrderStatus.Pending),
            DeliveredOrders = orders.Count(o =>
                o.Status == OrderStatus.Delivered),
            TotalCustomers = customers.Count(),
            TotalCouriers = couriers.Count(),
            ActiveCouriers = couriers.Count(c => c.IsAvailable)
        };
    }
}