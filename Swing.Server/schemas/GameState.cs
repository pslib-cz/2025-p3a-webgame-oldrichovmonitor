namespace Swing.Server.classes
{
    // GameState.cs
public class GameState
{
    public decimal Balance { get; private set; } = 1000;

    // Definice hranic pro levely
    private readonly Dictionary<int, decimal> _levelThresholds = new()
    {
        { 1, 0 },
        { 2, 1000 },
        { 3, 5000 },
        { 4, 20000 },
        { 5, 100000 }
    };

    // Metoda, která vrátí číslo 1-5 podle balance
    public int GetCurrentLevel()
    {
        int level = 1;
        foreach (var threshold in _levelThresholds)
        {
            if (Balance >= threshold.Value)
            {
                level = threshold.Key;
            }
        }
        return level;
    }

    public bool PlaceBet(decimal amount)
    {
        if (amount <= 0 || amount > Balance) return false;
        Balance -= amount;
        return true;
    }

    public void AddWin(decimal amount)
    {
        if (amount > 0) Balance += amount;
    }
}
}
