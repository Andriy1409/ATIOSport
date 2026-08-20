using AtioSport.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AtioSport.Infrastructure.Persistence.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public static readonly Guid FootballId = new("11111111-1111-1111-1111-111111111101");
    public static readonly Guid FootballBootsId = new("11111111-1111-1111-1111-111111111102");
    public static readonly Guid FootballBallsId = new("11111111-1111-1111-1111-111111111103");
    public static readonly Guid FootballJerseysId = new("11111111-1111-1111-1111-111111111104");
    public static readonly Guid FootballGoalkeeperGearId = new("11111111-1111-1111-1111-111111111105");
    public static readonly Guid FootballTrainingEquipmentId = new("11111111-1111-1111-1111-111111111106");
    public static readonly Guid BasketballId = new("11111111-1111-1111-1111-111111111107");
    public static readonly Guid TennisId = new("11111111-1111-1111-1111-111111111108");

    private static readonly DateTime SeedCreatedAtUtc = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.Property(c => c.Name).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Slug).IsRequired().HasMaxLength(100);
        builder.HasIndex(c => c.Slug).IsUnique();

        builder.HasOne(c => c.ParentCategory)
            .WithMany(c => c.ChildCategories)
            .HasForeignKey(c => c.ParentCategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasData(
            Seed(FootballId, "Football", "football", null),
            Seed(FootballBootsId, "Football Boots", "football-boots", FootballId),
            Seed(FootballBallsId, "Footballs", "footballs", FootballId),
            Seed(FootballJerseysId, "Football Jerseys", "football-jerseys", FootballId),
            Seed(FootballGoalkeeperGearId, "Goalkeeper Gear", "goalkeeper-gear", FootballId),
            Seed(FootballTrainingEquipmentId, "Football Training Equipment", "football-training-equipment", FootballId),
            Seed(BasketballId, "Basketball", "basketball", null),
            Seed(TennisId, "Tennis", "tennis", null));
    }

    private static Category Seed(Guid id, string name, string slug, Guid? parentId) => new()
    {
        Id = id,
        Name = name,
        Slug = slug,
        ParentCategoryId = parentId,
        CreatedAtUtc = SeedCreatedAtUtc
    };
}
