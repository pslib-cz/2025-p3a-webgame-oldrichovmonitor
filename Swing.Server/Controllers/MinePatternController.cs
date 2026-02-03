using Microsoft.AspNetCore.Mvc;
using Swing.Server.classes;
using System.Collections.Generic;

namespace Swing.Server.Controllers
{
    [ApiController]
    [Route("api/MinePattern")]
    public class MinePatternController : ControllerBase
    {
        private readonly MinePattern _minePattern;
        private readonly Services.GameStateService _gameStateService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MinePatternController(MinePattern minePattern, Services.GameStateService gameStateService, IHttpContextAccessor httpContextAccessor)
        {
            _minePattern = minePattern;
            _gameStateService = gameStateService;
            _httpContextAccessor = httpContextAccessor;
        }

        private GameState GetState()
        {
            string userId = Request.Headers["X-User-Id"].FirstOrDefault() ?? "guest";
            return _gameStateService.GetState(userId);
        }

        [HttpGet("StartGame/{mines}")]
        public ActionResult<int[]> StartGame(int mines)
        {
            var state = GetState();
            state.CurrentMines.Clear();
            
            int[] ints = _minePattern.placement(mines);
            foreach (int i in ints)
            {
                state.CurrentMines.Add(i);
            }
            return Ok(ints);
        }

        [HttpGet("Reveal")]
        public ActionResult Reveal([FromQuery] int index)
        {
            var state = GetState();
            bool isMine = state.CurrentMines.Contains(index);
            return Ok(new { isMine });
        }

        [HttpGet("Multiplier")]
        public ActionResult<float> GetMultiplier([FromQuery] int openedTiles, [FromQuery] int mines)
        {
            float multiplier = _minePattern.returnMultiplier(openedTiles, mines);
            return Ok(multiplier);
        }
    }
}
