using AtioSport.Domain.Common;

namespace AtioSport.Domain.Entities;

public class Order : BaseEntity
{
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public Guid? UserId { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
