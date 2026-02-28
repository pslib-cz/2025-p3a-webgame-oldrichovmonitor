using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swing.Server.Data;

namespace Swing.Server.Controllers;

[ApiController]
[Route("api/games")]
public class GamesController : ControllerBase
{
    private readonly AppDbContext _context;

    public GamesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("memory")]
    public async Task<IActionResult> Memory()
    {
        var config = await _context.GameConfigs
            .FirstOrDefaultAsync(g => g.Key == "memory");

        if (config == null)
            return NotFound(new { message = "Memory config not found." });

        return Ok(new
        {
            patternLength = config.IntValue1,
            speedMs = config.IntValue2
        });
    }

    [HttpGet("time")]
    public async Task<IActionResult> Time()
    {
        var config = await _context.GameConfigs
            .FirstOrDefaultAsync(g => g.Key == "time");

        if (config == null)
            return NotFound(new { message = "Time config not found." });

        return Ok(new
        {
            minTime = config.IntValue1,
            maxTime = config.IntValue2
        });
    }

    [HttpGet("slider")]
    public async Task<IActionResult> Slider()
    {
        var config = await _context.GameConfigs
            .FirstOrDefaultAsync(g => g.Key == "slider");

        if (config == null)
            return NotFound(new { message = "Slider config not found." });

        return Ok(new
        {
            zoneWidthPx = config.IntValue1,
            speedMultiplier = config.FloatValue
        });
    }

    [HttpGet("cost")]
    public async Task<IActionResult> Cost()
    {
        var config = await _context.GameConfigs
            .FirstOrDefaultAsync(g => g.Key == "cost");

        if (config == null)
            return NotFound(new { message = "Cost config not found." });

        return Ok(new[]
        {
            config.IntValue1,
            config.IntValue2,
            config.IntValue3,
            (int)config.FloatValue
        });
    }
}
