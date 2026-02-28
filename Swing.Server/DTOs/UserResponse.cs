namespace Swing.Server.DTOs;

public class UserResponse
{
    public string Username { get; set; } = string.Empty;
    public int Money { get; set; }
    public List<int> UnlockedGames { get; set; } = new();
}
