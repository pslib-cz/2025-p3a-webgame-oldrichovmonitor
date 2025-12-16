using Microsoft.AspNetCore.Mvc;
using Swing.Server.classes;

namespace Swing.Server.Controllers
{
    [ApiController]
    [Route("api/MinePattern")]
    public class MinePatternController: ControllerBase
    {
        private readonly MinePattern _minePattern;

        public MinePatternController(MinePattern minePattern)
        {
            _minePattern = minePattern;
        }
        [HttpGet("StartGame/{mines}")]
        public ActionResult<GridCoordinates[]> generateMines(int mines)
        {
            int diamonds = 25 - mines;
            GridCoordinates[] gridCoordinates = _minePattern.placement(mines, diamonds);
            return Ok(gridCoordinates);
        }
    }
}
