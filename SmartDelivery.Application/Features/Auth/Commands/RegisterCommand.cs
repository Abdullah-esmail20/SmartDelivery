using MediatR;
using SmartDelivery.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Features.Auth.Commands
{
    public record RegisterCommand(
     string FullName,
     string Email,
     string Password,
     string Phone,
     string Address,
     string Role       // "Customer" أو "Courier"
 ) : IRequest<AuthDto>;
}
