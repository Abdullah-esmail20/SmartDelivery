using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SmartDelivery.Domain.Enums;

public enum OrderStatus                                                                             
{
    Pending,      
    Assigned,     
    PickedUp,     
    InTransit,    
    Delivered,    
    Cancelled     
}
