using Microsoft.AspNetCore.Mvc;
using Swing.Server.classes;

namespace Swing.Server.Controllers
{
    [ApiController]
    [Route("api/TimeSwing")]
    public class TimeSwingController : ControllerBase
    {
        private readonly TimeSwing _timeSwing;

        public TimeSwingController(TimeSwing timeSwing)
        {
            _timeSwing = timeSwing;
        }
        [HttpGet("start")]
        public ActionResult<TimeSwingReturn> Start()
        {
            return Ok(new TimeSwingReturn(_timeSwing.highestTime, _timeSwing.lowestTime, _timeSwing.basePrecision, _timeSwing.precisionMultiplier));
        }
        [HttpGet("Result")]
        public ActionResult<float> GetResult([FromQuery] int targetTime, [FromQuery] int stoppedTime, [FromQuery] int bet)
        {
            if (stoppedTime > 1000 || stoppedTime < 0)
                return Ok(0f);

            float baseMultiplier = targetTime switch
            {
                <= 3000 => 3.0f,
                <= 5000 => 2.5f,
                <= 7000 => 2.0f,
                _ => 1.5f
            };

            int diff = Math.Abs(stoppedTime);
            float multiplier = baseMultiplier * (float)Math.Exp(-diff / 1000.0);
            if (multiplier < 1.0f) multiplier = 1.0f;
            float win = bet * multiplier;
            return Ok(win);
        }
    }

    public class TimeSwingReturn
    {
        public int highTime { get; set; }
        public int lowTime { get; set; }
        public float basePrecision { get; set; }
        public float precisionMultiplier { get; set; }

        public TimeSwingReturn(int highTime, int lowTime, float basePrecision, float precisionMultiplier)
        {
            this.highTime = highTime;
            this.lowTime = lowTime;
            this.basePrecision = basePrecision;
            this.precisionMultiplier = precisionMultiplier;
        }
    }
}
