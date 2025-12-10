using Microsoft.EntityFrameworkCore;
using Swing.Server.classes;

namespace Swing.Server.dbcontexts
{
    public class AppDbContext: DbContext
    {
        public DbSet<User> Users { get; set; }
        public AppDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {
            
        }


    }
}
