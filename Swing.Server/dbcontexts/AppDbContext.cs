using Microsoft.EntityFrameworkCore;
using Swing.Server.classes;

namespace Swing.Server.dbcontexts
{
    public class AppDbContext
    {
        public DbSet<User> Users { get; set; }

        
    }
}
