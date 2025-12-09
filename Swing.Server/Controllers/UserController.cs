using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Swing.Server.classes;
using Swing.Server.dbcontexts;

namespace Swing.Server.Controllers
{
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly GridCoordinates _gridCoordinates;
        private readonly MemoryPattern _memoryPattern;
        private readonly MinePattern _minePattern;

        public UserController(AppDbContext dbContext, GridCoordinates gridCoordinates, MemoryPattern memoryPattern, MinePattern minePattern)
        {
            _dbContext = dbContext;
            _gridCoordinates = gridCoordinates;
            _memoryPattern = memoryPattern;
            _minePattern = minePattern;
        }

        [HttpGet("{name}/{password}")]
        public async Task<ActionResult<bool>> isPasswordCorrect(string name, string password)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.Name == name);
            if (user == null)
            {
                return Ok(false);
            }
            if (user.isCorrectPassword(password))
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }
        [HttpPost("{name}/{password}")]
        public async Task<ActionResult<User>> addNewUser(string password, string name)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.Name == name);
            if (user == null)
            {
                _dbContext.Users.Add(new User { money = 1000, Name = name, Password = password});
                return Ok(user);
            }
        }

        [HttpDelete("{name}/{password}")]
        public async Task<ActionResult<User>> deleteUser(string password, string name)
        {
            User user = _dbContext.Users.FirstOrDefault(u => u.Name == name);
            if(user != null)
            {
                if (user.isCorrectPassword(password))
                {
                    _dbContext.Users.Remove(user);
                    return Ok(user);
                }
            }
        }
    }
}
