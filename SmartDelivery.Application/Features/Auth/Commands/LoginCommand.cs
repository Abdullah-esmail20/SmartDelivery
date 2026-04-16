using MediatR;
using SmartDelivery.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Features.Auth.Commands
{
    public record LoginCommand(
     string Email,
     string Password
 ) : IRequest<AuthDto>;
}
