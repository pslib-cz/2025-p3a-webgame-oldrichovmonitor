using Microsoft.EntityFrameworkCore;
using Swing.Server.Models;

namespace Swing.Server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<UserGameData> UserGameData => Set<UserGameData>();
    public DbSet<GameConfig> GameConfigs => Set<GameConfig>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<GameConfig>().HasData(
            new GameConfig { Id = 1, Key = "memory", IntValue1 = 3, IntValue2 = 800 },
            new GameConfig { Id = 2, Key = "time", IntValue1 = 5000, IntValue2 = 12000 },
            new GameConfig { Id = 3, Key = "slider", IntValue1 = 15, FloatValue = 1.5f },
            new GameConfig{Id = 4,Key = "cost",IntValue1 = 5000, IntValue2 = 20000, IntValue3 = 50000, FloatValue = 100000}

        );
    }
}
