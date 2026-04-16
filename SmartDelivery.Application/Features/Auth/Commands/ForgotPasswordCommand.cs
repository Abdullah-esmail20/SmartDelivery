using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Features.Auth.Commands
{
    public record ForgotPasswordCommand(
       string Email,
       string NewPassword
   ) : IRequest<string>; // يرجع رسالة نصية فقط
}
