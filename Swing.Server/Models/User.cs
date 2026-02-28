using System.ComponentModel.DataAnnotations;

namespace Swing.Server.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    public int Money { get; set; } = 0;

    public List<UserGameData> UnlockedGames { get; set; } = new();
}

