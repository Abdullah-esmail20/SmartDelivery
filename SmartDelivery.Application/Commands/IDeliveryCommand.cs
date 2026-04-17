using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartDelivery.Application.Commands;

// ✅ شرط 6 (ثاني واحد): Behavioural Design Pattern — Command
// Command: نحول الطلبات لـ Objects مستقلة يمكن تنفيذها، إلغاؤها، وتسجيلها
// الفرق عن CQRS: هذا Pattern معماري للتحكم بالعمليات

// الـ Interface الأساسي لكل Command
public interface IDeliveryCommand
{
    Task ExecuteAsync();
    Task UndoAsync(); // ✅ ميزة Command: نقدر نتراجع عن العملية
}