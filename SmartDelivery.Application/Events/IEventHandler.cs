using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// IEventHandler.cs
namespace SmartDelivery.Application.Events;

// ✅ شرط 6 (أول واحد): Behavioural Design Pattern — Observer
// Observer: عند حدوث حدث، يُخطر كل المشتركين تلقائياً
// مثل: عند تغيير حالة الطلب → أخطر العميل + سجل في Log

// الـ Interface الذي يطبقه كل Observer
public interface IEventHandler<TEvent>
{
    Task HandleAsync(TEvent eventData);
}
