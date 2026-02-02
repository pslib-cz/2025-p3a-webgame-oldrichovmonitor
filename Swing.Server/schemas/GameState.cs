namespace Swing.Server.classes
{
    public class GameState
    {
        public decimal Balance { get; private set; } = 1000;
        public string Username { get; set; } = "";
        public HashSet<string> UnlockedGameIds { get; private set; } = new();

        private readonly Dictionary<int, decimal> _levelThresholds = new()
    {
        { 1, 2000 },
        { 2, 8000 },
        { 3, 20000 },
        { 4, 40000 }
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

        public bool CanPlayGame(string gameId)
        {
            if (UnlockedGameIds.Contains(gameId)) return true;
            var game = GameLibrary.AllGames.FirstOrDefault(g => g.Id == gameId);
            if (game == null) return false;
            return false;
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
                isLocked = !UnlockedGameIds.Contains(game.Id)
            });
        }

        public int GetAvailableUnlockPoints()
        {
            return GetCurrentLevel() - UnlockedGameIds.Count;
        }

        public bool UnlockGame(string gameId)
        {
            var game = GameLibrary.AllGames.FirstOrDefault(g => g.Id == gameId);
            if (game == null) return false;

            if (GetAvailableUnlockPoints() <= 0) return false;

            if (UnlockedGameIds.Contains(gameId)) return false;

            UnlockedGameIds.Add(gameId);
            return true;
        }
    }
}
