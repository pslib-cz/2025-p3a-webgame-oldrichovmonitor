using Microsoft.AspNetCore.Mvc;
using Swing.Server.classes;

namespace Swing.Server.Controllers
{
    [ApiController]
    [Route("api/Game")]
    public class GameStateController : ControllerBase
    {
        private readonly Services.GameStateService _gameStateService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GameStateController(Services.GameStateService gameStateService, IHttpContextAccessor httpContextAccessor)
        {
            _gameStateService = gameStateService;
            _httpContextAccessor = httpContextAccessor;
        }

        private UserData GetState()
        {
            string userId = Request.Headers["X-User-Id"].FirstOrDefault() ?? "guest";
            return _gameStateService.GetState(userId);
        }

        [HttpGet("Status")]
        public IActionResult GetStatus()
        {
            var state = GetState();
            return Ok(new
            {
                balance = state.Balance,
                username = state.Username,
                level = state.GetCurrentLevel(),
                games = state.GetGames(),
                unlockPoints = state.GetAvailableUnlockPoints(),
                unlockCost = state.UnlockCost,
                hasUsedFreeUnlock = state.HasUsedFreeUnlock
            });
        }

        [HttpPost("Bet")]
        public IActionResult PlaceBet([FromQuery] decimal amount, [FromQuery] string gameId)
        {
            var state = GetState();
            if(!state.CanPlayGame(gameId)) return BadRequest("Game locked");
            
            if (state.PlaceBet(amount))
            {
                return Ok(new { success = true, newBalance = state.Balance });
            }
            return BadRequest("Insufficient balance");
        }

        [HttpPost("SetUsername")]
        public IActionResult SetUsername([FromQuery] string name)
        {
            if (string.IsNullOrEmpty(name)) return BadRequest("Name required");
            if (name.Length > 15) name = name[..15];

            var state = GetState();
            state.SetUserame(name);
            return Ok(new { success = true });
        }

        [HttpPost("Win")]
        public IActionResult AddWin([FromQuery] decimal amount)
        {
             var state = GetState();
             state.AddWin(amount);
             return Ok(new { newBalance = state.Balance });
        }

        [HttpPost("Unlock")]
        public IActionResult UnlockGame([FromQuery] string gameId)
        {
            var state = GetState();
            if (state.UnlockGame(gameId))
            {
                return Ok(new { success = true, newBalance = state.Balance });
            }
            return BadRequest("Insufficient balance or game already unlocked!");
        }

        [HttpPost("Reset")]
        public IActionResult ResetGame()
        {
            var state = GetState();
            state.Reset();
            return Ok(new { success = true, message = "Game reset successfully" });
        }
    }
}