using MediatR;
using SmartDelivery.Application.DTOs;
using SmartDelivery.Domain.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace SmartDelivery.Application.Features.Auth.Commands;

public class LoginHandler : IRequestHandler<LoginCommand, AuthDto>
{
    private readonly IUserRepository _userRepository;

    public LoginHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<AuthDto> Handle(LoginCommand request,
                                      CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user is null)
            return new AuthDto { Message = "الإيميل أو كلمة المرور غير صحيحة" };

        var passwordHash = HashPassword(request.Password);

        if (user.PasswordHash != passwordHash)
            return new AuthDto { Message = "الإيميل أو كلمة المرور غير صحيحة" };

        return new AuthDto
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            Message = "تم تسجيل الدخول بنجاح",
            // ✅ هذا كان ناقصاً — نرجع courierId و customerId
            CustomerId = user.CustomerId,
            CourierId = user.CourierId
        };
    }

    private static string HashPassword(string password)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        return Convert.ToHexString(bytes);
    }
}