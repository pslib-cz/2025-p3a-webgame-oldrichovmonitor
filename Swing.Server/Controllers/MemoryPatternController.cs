using Microsoft.AspNetCore.Mvc;
using Swing.Server.classes;

namespace Swing.Server.Controllers
{
    [ApiController]
    [Route("api/MemoryPattern")]
    public class MemoryPatternController : ControllerBase
    {
        private readonly Services.GameStateService _gameStateService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MemoryPatternController(Services.GameStateService gameStateService, IHttpContextAccessor httpContextAccessor)
        {
            _gameStateService = gameStateService;
            _httpContextAccessor = httpContextAccessor;
        }

        private GameState GetState()
        {
            string userId = Request.Headers["X-User-Id"].FirstOrDefault() ?? "guest";
            return _gameStateService.GetState(userId);
        }

        [HttpGet("StartGame")]
        public ActionResult<object> start()
        {
             // Legacy endpoint mostly, but we can return basic config
             return Ok(new { startSequence = 3, showSpeed = 300 });
        }

        [HttpGet("NextSequence/{length}")]
        public ActionResult<int[]> generate(int length)
        {
            return Ok(new int[0]); // disable legacy
        }

        [HttpGet("GeneratePattern")]
        public ActionResult<List<int>> GeneratePattern([FromQuery] int length, [FromQuery] bool newGame = false)
        {
            var state = GetState();
            
            if (newGame)
            {
                state.MemorySequence.Clear();
                // Generate initial sequence of length 'length' (usually 3)
                while(state.MemorySequence.Count < length)
                {
                    int nextNum = Random.Shared.Next(0, 16); 
                    // Should we allow duplicates? Original code checked !Contains.
                    if (!state.MemorySequence.Contains(nextNum))
                    {
                        state.MemorySequence.Add(nextNum);
                    }
                }
            }
            else
            {
                // Add ONE more number to existing sequence
                // Ideally length passed from frontend matches current+1, but we can trust our state more
                
                // Ensure we have at least something if not newGame but empty (fallback)
                if (state.MemorySequence.Count == 0)
                {
                    // Fallback to generating 3
                     while(state.MemorySequence.Count < 3)
                    {
                        int nextNum = Random.Shared.Next(0, 16);
                        if (!state.MemorySequence.Contains(nextNum)) state.MemorySequence.Add(nextNum);
                    }
                }
                else
                {
                     // Add one new number logic
                     int attempts = 0;
                     while(attempts < 50) 
                     {
                        int nextNum = Random.Shared.Next(0, 16);
                        if (!state.MemorySequence.Contains(nextNum))
                        {
                            state.MemorySequence.Add(nextNum);
                            break;
                        }
                        attempts++;
                     }
                }
            }

            return Ok(state.MemorySequence);
        }

        [HttpPost("CheckPattern")]
        public ActionResult<bool> CheckPattern([FromBody] List<int> userInput)
        {
             // We can validate on backend if needed, but for now frontend handles it.
             return Ok(true); 
        }

        [HttpGet("Multiplier")]
        public ActionResult<float> GetMultiplier([FromQuery] int length)
        {
            // return Ok(new int[0]); // REMOVED ERROR
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
