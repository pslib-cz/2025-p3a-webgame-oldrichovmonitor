using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Swing.Server.classes
{
    public class User
    {
        [Key]
        public string Name { get; set; }
        public string Password { get; set; }
        public int money { get; set; }

        public bool isCorrectPassword(string password)
        {
            if(password == Password) return true;
            return false;
        }
    }
}
