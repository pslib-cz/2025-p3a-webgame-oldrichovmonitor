namespace Swing.Server.classes
{
    public class GameState
    {
        public decimal Balance { get; private set; } = 1000;
        public string Username { get; set; } = "";
        public HashSet<string> UnlockedGameIds { get; private set; } = new();
        public decimal UnlockCost 
        { 
            get 
            {
                int nextCount = UnlockedGameIds.Count + 1;
                if (_levelThresholds.TryGetValue(nextCount, out decimal cost))
                {
                    return cost;
                }
                return decimal.MaxValue;
            }
        }
        
        public bool HasUsedFreeUnlock { get; private set; } = false;
        
        public HashSet<int> CurrentMines { get; set; } = new();

        public List<int> MemorySequence { get; set; } = new();

    private readonly Dictionary<int, decimal> _levelThresholds = new()
    {
        { 1, 0 },
        { 2, 5000 },
        { 3, 25000 },
        { 4, 100000 }
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

            if (UnlockedGameIds.Contains(gameId)) return false;

            decimal cost = UnlockCost;

            if (cost == 0 && !HasUsedFreeUnlock)
            {
                UnlockedGameIds.Add(gameId);
                HasUsedFreeUnlock = true;
                return true;
            }

            if (Balance < cost) return false;

            Balance -= cost;
            UnlockedGameIds.Add(gameId);
            
            return true;
        }

        public void Reset()
        {
            Balance = 1000;
            Username = "";
            UnlockedGameIds.Clear();
            HasUsedFreeUnlock = false;
        }
    }
}
