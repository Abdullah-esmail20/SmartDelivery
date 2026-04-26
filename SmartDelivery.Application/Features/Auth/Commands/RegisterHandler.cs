using MediatR;
using SmartDelivery.Application.DTOs;
using SmartDelivery.Domain.Entities;
using SmartDelivery.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Features.Auth.Commands
{
    public class RegisterHandler : IRequestHandler<RegisterCommand, AuthDto>
    {
        private readonly IUserRepository _userRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly ICourierRepository _courierRepository;

        public RegisterHandler(IUserRepository userRepository,
                               ICustomerRepository customerRepository,
                               ICourierRepository courierRepository)
        {
            _userRepository = userRepository;
            _customerRepository = customerRepository;
            _courierRepository = courierRepository;
        }

        public async Task<AuthDto> Handle(RegisterCommand request,
                                          CancellationToken cancellationToken)
        {
            // 1. تحقق أن الإيميل غير مستخدم
            if (await _userRepository.EmailExistsAsync(request.Email))
            {
                return new AuthDto { Message = "الإيميل مستخدم مسبقاً" };
            }

            // 2. تشفير كلمة المرور قبل الحفظ
            var passwordHash = HashPassword(request.Password);

            Guid? customerId = null;
            Guid? courierId = null;

            // 3. إنشاء العميل أو الكورير حسب الـ Role
            if (request.Role == "Customer")
            {
                var customer = Customer.Create(
                    request.FullName, request.Email,
                    request.Phone, request.Address);

                await _customerRepository.AddAsync(customer);
                customerId = customer.Id;
            }
            else if (request.Role == "Courier")
            {
                var courier = Courier.Create(request.FullName, request.Phone);
                await _courierRepository.AddAsync(courier);
                courierId = courier.Id;
            }

            // 4. إنشاء حساب المستخدم
            var user = AppUser.Create(request.Email, passwordHash,
                                      request.Role, customerId, courierId);

            await _userRepository.AddAsync(user);

            return new AuthDto
            {
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role,
                Message = "تم التسجيل بنجاح",
                 CustomerId = customerId,
                CourierId = courierId
            };
        }

        // دالة تشفير كلمة المرور بـ SHA256
        private static string HashPassword(string password)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
            return Convert.ToHexString(bytes);
        }
    }
}
