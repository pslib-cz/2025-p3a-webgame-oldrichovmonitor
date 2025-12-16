using Microsoft.AspNetCore.Mvc;
using Swing.Server.classes;

namespace Swing.Server.Controllers
{
    [ApiController]
    [Route("api/PrecisionSlider")]
    public class PrecisionSliderController : ControllerBase
    {
        private readonly PrecisionSlider _precisionSlider;

        public PrecisionSliderController(PrecisionSlider precisionSlider)
        {
            _precisionSlider = precisionSlider;
        }
        [HttpGet("Start")]
        public ActionResult<TimeSwingReturn> StartData()
        {
            return Ok(new PrecisionSliderReturn(_precisionSlider.starterSpeed, _precisionSlider.speedMultiplier, _precisionSlider.starterArea, _precisionSlider.areaMultiplier));

        }
    }

    public class PrecisionSliderReturn
    {
        public int startSpeed { get; set; }
        public float speedMultiplier { get; set; }
        public int startArea { get; set; }
        public float areaMultiplier { get; set; }

        public PrecisionSliderReturn(int startSpeed, float speedMultiplier, int startArea, float areaMultiplier)
        {
            this.startSpeed = startSpeed;
            this.speedMultiplier = speedMultiplier;
            this.startArea = startArea;
            this.areaMultiplier = areaMultiplier;
        }
    }
}
