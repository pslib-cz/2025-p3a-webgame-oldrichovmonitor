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
        private static HashSet<int> _currentMines = new HashSet<int>();

        public MinePatternController(MinePattern minePattern)
        {
            _minePattern = minePattern;
        }

        [HttpGet("StartGame/{mines}")]
        public ActionResult<int[]> StartGame(int mines)
        {
            var random = new Random();
            _currentMines.Clear();
            while (_currentMines.Count < mines)
            {
                _currentMines.Add(random.Next(0, 26));
            }
            return Ok(_currentMines.ToArray());
        }

        [HttpGet("Reveal")]
        public ActionResult Reveal([FromQuery] int index)
        {
            bool isMine = _currentMines.Contains(index);
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
