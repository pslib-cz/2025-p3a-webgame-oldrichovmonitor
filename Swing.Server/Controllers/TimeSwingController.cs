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
    }

    public class TimeSwingReturn
    {
        public int highTime {  get; set; }
        public int lowTime { get; set; }
        public float basePrecision {  get; set; }
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
