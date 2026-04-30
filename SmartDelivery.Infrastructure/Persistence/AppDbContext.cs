using MassTransit;
using Microsoft.EntityFrameworkCore;
using SmartDelivery.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        // DbContext هو الجسر بين الكود و قاعدة البيانات
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // كل DbSet يمثل جدول في قاعدة البيانات
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<Courier> Couriers => Set<Courier>();
        public DbSet<Customer> Customers => Set<Customer>();

        public DbSet<Ticket> Tickets => Set<Ticket>();
        public DbSet<TicketReply> TicketReplies => Set<TicketReply>();
        public DbSet<AppUser> Users => Set<AppUser>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // نقول لـ EF Core يطبق إعدادات الجداول من مجلد Configurations
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

            base.OnModelCreating(modelBuilder);
        }
    }
}
