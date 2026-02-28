using System.ComponentModel.DataAnnotations;

namespace Swing.Server.DTOs;

public class UpdateUserRequest
{
    [Required]
    [Range(0, int.MaxValue, ErrorMessage = "Money cannot be negative.")]
    public int Money { get; set; }

    [Required]
    public List<int> UnlockedGames { get; set; } = new();
}
