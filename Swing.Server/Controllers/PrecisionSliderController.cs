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
        public ActionResult<PrecisionSliderReturn> StartData()
        {
            return Ok(new PrecisionSliderReturn(
                _precisionSlider.starterSpeed,
                _precisionSlider.speedMultiplier,
                _precisionSlider.starterArea,
                _precisionSlider.areaMultiplier,
                _precisionSlider.MaxMultiplier
            ));
        }

        [HttpGet("Multiplier")]
        public ActionResult<float> GetMultiplier([FromQuery] float distance)
        {
            if (distance < 0) distance = -distance;

            if (distance > 50) return Ok(0.0f);

            float t = distance / 50.0f;

            float multiplier = _precisionSlider.MaxMultiplier * (1.0f - t);

            return Ok((float)Math.Round(multiplier, 2));
        }
    }

    public class PrecisionSliderReturn
    {
        public int startSpeed { get; set; }
        public float speedMultiplier { get; set; }
        public int startArea { get; set; }
        public float areaMultiplier { get; set; }
        public float maxMultiplier { get; set; }

        public PrecisionSliderReturn(int startSpeed, float speedMultiplier, int startArea, float areaMultiplier, float maxMultiplier)
        {
            this.startSpeed = startSpeed;
            this.speedMultiplier = speedMultiplier;
            this.startArea = startArea;
            this.areaMultiplier = areaMultiplier;
            this.maxMultiplier = maxMultiplier;
        }
    }
}
