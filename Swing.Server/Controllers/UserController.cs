using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swing.Server.Data;
using Swing.Server.DTOs;
using Swing.Server.Models;

namespace Swing.Server.Controllers;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users
            .Include(u => u.UnlockedGames)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound(new { message = "User not found." });

        return Ok(new UserResponse
        {
            Username = user.Username,
            Money = user.Money,
            UnlockedGames = user.UnlockedGames.Select(g => g.GameIndex).ToList()
        });
    }

    [HttpPost("{id:int}/reset")]
    public async Task<IActionResult> Reset(int id)
    {
        var user = await _context.Users
            .Include(u => u.UnlockedGames)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound(new { message = "User not found." });

        user.Money = 1000;
        _context.UserGameData.RemoveRange(user.UnlockedGames);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _context.Users
            .Include(u => u.UnlockedGames)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound(new { message = "User not found." });

        if (request.Money < 0)
            return BadRequest(new { message = "Money cannot be negative." });

        user.Money = request.Money;
        _context.UserGameData.RemoveRange(user.UnlockedGames);

        foreach (var gameIndex in request.UnlockedGames.Distinct())
        {
            _context.UserGameData.Add(new UserGameData
            {
                UserId = id,
                GameIndex = gameIndex
            });
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }
}
