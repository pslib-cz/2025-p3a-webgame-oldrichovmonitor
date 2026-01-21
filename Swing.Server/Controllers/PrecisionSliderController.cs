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
                _precisionSlider.starterSpeed
            ));
        }

        [HttpGet("Multiplier")]
        public ActionResult<float> GetMultiplier([FromQuery] float distance)
        {
            distance = Math.Abs(distance);
            if (distance > 50) return Ok(0.0f);
            float t = distance / 50.0f;
            float multiplier = _precisionSlider.MaxMultiplier * (float)Math.Pow(1.0f - t, _precisionSlider.Difficulty);

            return Ok((float)Math.Round(multiplier, 2));
        }
    }

    public class PrecisionSliderReturn
    {
        public int startSpeed { get; set; }

        public PrecisionSliderReturn(int startSpeed)
        {
            this.startSpeed = startSpeed;
        }
    }
}
