namespace Swing.Server.classes
{
    public class GameState
    {
        public decimal Balance { get; private set; } = 1000;
        public string Username { get; set; } = "";

        private readonly Dictionary<int, decimal> _levelThresholds = new()
    {
        { 1, 0 },
        { 2, 1000 },
        { 3, 1100 },
        { 4, 20000 }
    };

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
        public void SetUserame(string name)
        {
            Username = name;
        }

        public object GetGames()
        {
            int Level = GetCurrentLevel();

            return GameLibrary.AllGames.Select(game => new
            {
                id = game.Id,
                name = game.Name,
                description = game.Description,
                route = game.Route,
                minLevel = game.MinLevel,
                isLocked = Level < game.MinLevel
            });
        }
    }
}
