using Microsoft.EntityFrameworkCore;
using SmartDelivery.Application.Events;
using SmartDelivery.Application.Features.Orders.Commands;
using SmartDelivery.Application.Services;
using SmartDelivery.Domain.Interfaces;
using SmartDelivery.Infrastructure.Adapters;
using SmartDelivery.Infrastructure.Messaging;
using SmartDelivery.Infrastructure.Persistence;
using SmartDelivery.Infrastructure.Persistence.Repositories;
using System;
// في أعلى الملف أضف:
using SmartDelivery.API.Hubs;
using SmartDelivery.API.Services;



var builder = WebApplication.CreateBuilder(args);



// ✅ شرط 10: تسجيل SignalR
builder.Services.AddSignalR();

// ✅ ربط INotificationService بالتنفيذ الفعلي
builder.Services.AddScoped<INotificationService, NotificationService>();
// ── 1. قاعدة البيانات ──────────────────────────────
// نربط AppDbContext بـ SQL Server باستخدام الـ Connection String
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);


// أضف هذا قبل builder.Build()
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        // نسمح لـ React (port 3001) بالاتصال بالـ API
        policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:3002",
                "http://localhost:3003"

            )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // مهم لـ SignalR
    });
});


// ── 2. Repositories ────────────────────────────────
// نسجل كل Repository حتى يعرف الـ API يستخدمه
// كلما طلب كود IOrderRepository يعطيه OrderRepository
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<ICourierRepository, CourierRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();




// ✅ شرط 5: Facade
builder.Services.AddScoped<DeliveryFacade>();

// ✅ شرط 5: Adapter
builder.Services.AddScoped<ILocationAdapter, LocationAdapter>();

// ✅ شرط 6: Observer
builder.Services.AddScoped<IEventHandler<OrderStatusChangedEvent>,
                            OrderStatusNotificationHandler>();
builder.Services.AddScoped<EventDispatcher>();

// ✅ شرط 8: ESB — تسجيل RabbitMQ + MassTransit
builder.Services.AddMessaging();




// ── 3. MediatR (CQRS) ──────────────────────────────
// نقول لـ MediatR يبحث عن كل الـ Handlers في Application
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(
        typeof(CreateOrderHandler).Assembly
    )
);

// ── 4. Controllers + Swagger ───────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ── 5. Auto Migration ──────────────────────────────
// ينشئ قاعدة البيانات تلقائياً عند تشغيل البرنامج
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// ── 6. Middleware ──────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// فعّل CORS قبل أي Middleware آخر
app.UseCors("AllowReact");
app.UseAuthorization();
app.MapControllers();



// ✅ شرط 10: تحديد مسار الـ Hub
// العملاء يتصلون عبر: wss://localhost:xxxx/hubs/delivery
app.MapHub<DeliveryHub>("/hubs/delivery");


app.Run();