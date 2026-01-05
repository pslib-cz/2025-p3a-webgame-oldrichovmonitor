using Microsoft.AspNetCore.Mvc;
using Swing.Server.classes;

namespace Swing.Server.Controllers
{
    [ApiController]
    [Route("api/MemoryPattern")]
    public class MemoryPatternController : ControllerBase
    {
        private static List<int> _currentPattern = new List<int>();
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
            return Ok(_memoryPattern.setPattern(length));
        }
        [HttpGet("GeneratePattern")]
        public ActionResult<List<int>> GeneratePattern([FromQuery] int length)
        {
            var random = new Random();
            _currentPattern.Clear();
            while (_currentPattern.Count < length)
            {
                int next = random.Next(0, 17);
                if (!_currentPattern.Contains(next))
                    _currentPattern.Add(next);
            }
            return Ok(_currentPattern);
        }
        [HttpPost("CheckPattern")]
        public ActionResult<bool> CheckPattern([FromBody] List<int> userInput)
        {
            bool correct = _currentPattern.SequenceEqual(userInput);
            return Ok(correct);
        }
    }



    public class MemoryPatternReturn
    {
        public int startSize { get; set; }
        public int startSpeed { get; set; }
        public GridCoordinates[] pattern { get; set; }
        public float speedIncrease { get; set; }

        public MemoryPatternReturn(int startSize, int startSpeed, GridCoordinates[] pattern, float speedIncrease)
        {
            this.startSize = startSize;
            this.startSpeed = startSpeed;
            this.pattern = pattern;
            this.speedIncrease = speedIncrease;
        }
    }
    
}
