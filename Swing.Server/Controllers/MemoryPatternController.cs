using Microsoft.AspNetCore.Mvc;
using Swing.Server.classes;

namespace Swing.Server.Controllers
{
    [ApiController]
    [Route("api/MemoryPattern")]
    public class MemoryPatternController : ControllerBase
    {
        private readonly MemoryPattern _memoryPattern;

        public MemoryPatternController(MemoryPattern memoryPattern)
        {
            _memoryPattern = memoryPattern;
        }
        [HttpGet("StartGame")]
        public ActionResult<MemoryPatternReturn> start()
        {
            return Ok(new MemoryPatternReturn(_memoryPattern.startSequence, _memoryPattern.showSpeed, _memoryPattern.setPattern(_memoryPattern.startSequence), _memoryPattern.speedMultiplier));
        }
        [HttpGet("NextSequence/{length}")]
        public ActionResult<GridCoordinates[]> generate(int length)
        {
            return Ok(new int[0]); // disable legacy
        }

        [HttpGet("GeneratePattern")]
        public ActionResult<List<int>> GeneratePattern([FromQuery] int length, [FromQuery] bool newGame = false)
        {
            var pattern = _memoryPattern.setPattern(length, newGame);
            Console.WriteLine($"[MemoryPattern] Length: {length}, NewGame: {newGame}, Pattern: {string.Join(",", pattern)}");
            return Ok(pattern.ToList());
        }
        [HttpPost("CheckPattern")]
        public ActionResult<bool> CheckPattern([FromBody] List<int> userInput)
        {
            var current = _memoryPattern.setPattern(0, false); // Get current without adding? No logic for length 0.
            return Ok(true); 
        }

        [HttpGet("Multiplier")]
        public ActionResult<float> GetMultiplier([FromQuery] int length)
        {
            return Ok(new int[0]);
            double[] fixedMultipliers = { 1.01, 1.1, 1.2, 1.5, 2.1, 3.2, 5.0, 8.5, 15, 32 };
            int index = length - 3;

            if (index < 0) return Ok(0.0f); // Should not happen in normal flow
            if (index >= fixedMultipliers.Length) return Ok(fixedMultipliers.Last());

            return Ok((float)fixedMultipliers[index]);
        }
    }



    public class MemoryPatternReturn
    {
        public int startSize { get; set; }
        public int startSpeed { get; set; }
        public int[] pattern { get; set; }
        public float speedIncrease { get; set; }

        public MemoryPatternReturn(int startSize, int startSpeed, int[] pattern, float speedIncrease)
        {
            this.startSize = startSize;
            this.startSpeed = startSpeed;
            this.pattern = pattern;
            this.speedIncrease = speedIncrease;
        }
    }

}
