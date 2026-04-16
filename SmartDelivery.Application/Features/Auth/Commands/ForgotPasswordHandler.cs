using MediatR;
using SmartDelivery.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Features.Auth.Commands
{
    public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordCommand, string>
    {
        private readonly IUserRepository _userRepository;

        public ForgotPasswordHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<string> Handle(ForgotPasswordCommand request,
                                         CancellationToken cancellationToken)
        {
            // 1. ابحث عن المستخدم بالإيميل
            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user is null)
                return "الإيميل غير موجود في النظام";

            // 2. شفّر كلمة المرور الجديدة
            var newHash = HashPassword(request.NewPassword);

            // 3. غيّر كلمة المرور
            user.ChangePassword(newHash);
            await _userRepository.UpdateAsync(user);

            return "تم تغيير كلمة المرور بنجاح";
        }

        private static string HashPassword(string password)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
            return Convert.ToHexString(bytes);
        }
    }
}
