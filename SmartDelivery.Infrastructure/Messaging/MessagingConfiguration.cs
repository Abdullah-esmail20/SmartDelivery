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

    public static class MessagingConfiguration
    {
        public static IServiceCollection AddMessaging(
            this IServiceCollection services)
        {
            services.AddMassTransit(config =>
            {
                config.AddConsumer<OrderCreatedConsumer>();
                config.AddConsumer<OrderStatusUpdatedConsumer>();

                config.UsingRabbitMq((context, cfg) =>
                {
                    cfg.Host("rabbitmq://localhost", h =>
                    {
                        h.Username("guest"); // اسم المستخدم الافتراضي
                        h.Password("guest"); // كلمة المرور الافتراضية
                    });

                    cfg.ReceiveEndpoint("order-created-queue", e =>
                    {
                        e.ConfigureConsumer<OrderCreatedConsumer>(context);
                    });

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
