using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Identity.Client;
using Swing.Server.classes;
using Swing.Server.dbcontexts;

namespace Swing.Server.Controllers
{
    public class UserController : ControllerBase
    {
        //private readonly AppDbContext _dbContext;
        
        private readonly PrecisionSlider _precisionSlider;
        private readonly TimeSwing _timeSwing;
        private readonly MemoryPattern _memoryPattern;
        private readonly MinePattern _minePattern;

        public UserController(/*AppDbContext dbContext,*/ PrecisionSlider precisionSlider, MemoryPattern memoryPattern, MinePattern minePattern, TimeSwing timeSwing)
        {
            //_dbContext = dbContext;
            _precisionSlider = precisionSlider;
            _memoryPattern = memoryPattern;
            _minePattern = minePattern;
            _timeSwing = timeSwing;
        }

        /*[HttpGet("{name}/{password}")]
        public async Task<ActionResult<bool>> isPasswordCorrect(string name, string password)
        {
            var user = await _dbContext.Users.FindAsync(name);
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
            var user = await _dbContext.Users.FindAsync(name);
            if (user == null)
            {
                User userNew = new User { money = 1000, Name = name, Password = password };
                _dbContext.Users.Add(userNew);
                await _dbContext.SaveChangesAsync();
                return Ok(user);
            }
            else { return BadRequest(user); }
        }

        [HttpDelete("{name}/{password}")]
        public async Task<ActionResult<User>> deleteUser(string password, string name)
        {
            User user = await _dbContext.Users.FindAsync(name);
            if(user != null)
            {
                if (user.isCorrectPassword(password))
                {
                    _dbContext.Users.Remove(user);
                    await _dbContext.SaveChangesAsync();
                    return Ok(user);
                }
            }
            return BadRequest(user);
        }*/
        [HttpGet("MinePattern/generate/{mines}")]
        public async Task<ActionResult<GridCoordinates[]>> generateMines(int mines)
        {
            int diamonds = 25 - mines;
            GridCoordinates[] gridCoordinates = _minePattern.placement(mines, diamonds);
            return Ok(gridCoordinates);
        }
        [HttpGet("MinePattern/multiplier/{openTiles} {mines}")]
        public async Task<ActionResult<float>> getNewMultiplier(int openTiles, int mines)
        {
            return Ok(_minePattern.returnMultiplier(openTiles, mines));
        }
        [HttpGet("MemoryPattern/startSequence")]
        public async Task<ActionResult<int>> startSequence()
        {
            return Ok(_memoryPattern.startSequence);
        }
        [HttpGet("MemoryPattern/speed")]
        public async Task<ActionResult<int>> speed()
        {
            return Ok(_memoryPattern.showSpeed);
        }
        [HttpGet("MemoryPattern/generate/{length}")]
        public async Task<ActionResult<GridCoordinates[]>> generateSequence(int length)
        {
            GridCoordinates[] result = _memoryPattern.setPattern(length);
            return Ok(result);
        }
        [HttpGet("TimeSwing/speed/{difficulty}")]
        public async Task<ActionResult<int>> getSpeed(int difficulty)
        {
            if (difficulty == 0)
            {
                return Ok(_timeSwing.easySpeed);
            }
            else if(difficulty == 1)
            {
                return Ok(_timeSwing.mediumSpeed);
            }
            else { return Ok(_timeSwing.hardSpeed);}
        }
        [HttpGet("TimeSwing/multiplier/{difficulty}")]
        public async Task<ActionResult<int>> getMultiplier(int difficulty)
        {
            if (difficulty == 0)
            {
                return Ok(_timeSwing.easyMultiplier);
            }
            else if (difficulty == 1)
            {
                return Ok(_timeSwing.mediumMultiplier);
            }
            else { return Ok(_timeSwing.hardMultiplier); }
        }
        [HttpGet("PrecisionSlider/area")]
        public async Task<ActionResult<int>> getArea()
        {
            return Ok(_precisionSlider.starterArea);
        }
        [HttpGet("PrecisionSlider/speed")]
        public async Task<ActionResult<int>> getSpeed()
        {
            return Ok(_precisionSlider.starterSpeed);
        }

    }
}
