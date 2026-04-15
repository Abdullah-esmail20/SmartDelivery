using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartDelivery.Domain.Entities;

namespace SmartDelivery.Infrastructure.Persistence.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        // اسم الجدول في قاعدة البيانات
        builder.ToTable("Orders");

        // المفتاح الأساسي
        builder.HasKey(o => o.Id);

        // الحقول المطلوبة وحدودها
        builder.Property(o => o.Description)
               .IsRequired()
               .HasMaxLength(500); // أقصى 500 حرف

        builder.Property(o => o.PickupAddress)
               .IsRequired()
               .HasMaxLength(300);

        builder.Property(o => o.DeliveryAddress)
               .IsRequired()
               .HasMaxLength(300);

        // نحفظ الـ Enum كنص في DB بدل رقم — أوضح عند قراءة البيانات
        builder.Property(o => o.Status)
               .HasConversion<string>();

        // علاقة Order مع Customer — طلب واحد لعميل واحد
        builder.HasOne(o => o.Customer)
               .WithMany()
               .HasForeignKey(o => o.CustomerId)
               .OnDelete(DeleteBehavior.Restrict); // لا تحذف الطلبات عند حذف العميل

        // علاقة Order مع Courier — الكورير ممكن يكون null في البداية
        builder.HasOne(o => o.Courier)
               .WithMany()
               .HasForeignKey(o => o.CourierId)
               .IsRequired(false) // CourierId ممكن يكون فاضي
               .OnDelete(DeleteBehavior.SetNull);
    }
}