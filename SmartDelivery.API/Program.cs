using Microsoft.EntityFrameworkCore;
using SmartDelivery.Application.Events;
using SmartDelivery.Application.Features.Orders.Commands;
using SmartDelivery.Application.Services;
using SmartDelivery.Domain.Interfaces;
using SmartDelivery.Infrastructure.Adapters;
using SmartDelivery.Infrastructure.Persistence;
using SmartDelivery.Infrastructure.Persistence.Repositories;
using System;

var builder = WebApplication.CreateBuilder(args);

// ── 1. قاعدة البيانات ──────────────────────────────
// نربط AppDbContext بـ SQL Server باستخدام الـ Connection String
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);




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
app.UseAuthorization();
app.MapControllers();

app.Run();