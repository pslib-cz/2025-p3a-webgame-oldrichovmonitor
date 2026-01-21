using Microsoft.AspNetCore.Mvc;
using Swing.Server.classes;

namespace Swing.Server.Controllers
{
    [ApiController]
    [Route("api/Game")]
    public class GameStateController : ControllerBase
    {
        private readonly GameState _gameState;

        public GameStateController(GameState gameState)
        {
            _gameState = gameState;
        }

        [HttpGet("Status")]
        public IActionResult GetStatus()
        {
            return Ok(new
            {
                balance = _gameState.Balance,
                level = _gameState.GetCurrentLevel()
            });
        }

        [HttpPost("Bet")]
        public IActionResult PlaceBet([FromQuery] decimal amount)
        {
            if (amount <= 0) return BadRequest("Invalid amount");

            if (_gameState.PlaceBet(amount))
            {
                return Ok(new { success = true, newBalance = _gameState.Balance });
            }
            return BadRequest("Insufficient balance!");
        }

        [HttpPost("Win")]
        public IActionResult AddWin([FromQuery] decimal amount)
        {
            if (amount < 0) return BadRequest("Invalid amount");

            _gameState.AddWin(amount);

            return Ok(new
            {
                balance = _gameState.Balance,
                level = _gameState.GetCurrentLevel()
            });
        }
    }
}