using Microsoft.Extensions.DependencyInjection;
using SmartDelivery.Infrastructure.Messaging.Consumers;
using MassTransit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Infrastructure.Messaging
{

    // ✅ شرط 8: إعداد ESB — نجمع كل إعدادات RabbitMQ في مكان واحد
    public static class MessagingConfiguration
    {
        public static IServiceCollection AddMessaging(
            this IServiceCollection services)
        {
            services.AddMassTransit(config =>
            {
                // ✅ نسجل كل الـ Consumers هنا
                config.AddConsumer<OrderCreatedConsumer>();
                config.AddConsumer<OrderStatusUpdatedConsumer>();

                config.UsingRabbitMq((context, cfg) =>
                {
                    // عنوان RabbitMQ — localhost للتطوير
                    cfg.Host("rabbitmq://localhost", h =>
                    {
                        h.Username("guest"); // اسم المستخدم الافتراضي
                        h.Password("guest"); // كلمة المرور الافتراضية
                    });

                    // ✅ Queue لطلبات جديدة
                    cfg.ReceiveEndpoint("order-created-queue", e =>
                    {
                        e.ConfigureConsumer<OrderCreatedConsumer>(context);
                    });

                    // ✅ Queue لتغييرات الحالة
                    cfg.ReceiveEndpoint("order-status-updated-queue", e =>
                    {
                        e.ConfigureConsumer<OrderStatusUpdatedConsumer>(context);
                    });
                });
            });

            return services;
        }
    }
}
