namespace Swing.Server.Models;

public class UserGameData
{
    public int Id { get; set; }

    public int GameIndex { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
