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
                return decimal.MaxValue; // Or handle as max level reached
            }
        }
        
        public bool HasUsedFreeUnlock { get; private set; } = false;

    private readonly Dictionary<int, decimal> _levelThresholds = new()
    {
        { 1, 0 },
        { 2, 4000 },
        { 3, 8000 },
        { 4, 16000 }
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

            // If cost is 0 (First level/Free), allow it regardless of balance checking (though 0 is always <= Balance)
            // But we specifically track HasUsedFreeUnlock for the UI 
            
            if (cost == 0 && !HasUsedFreeUnlock)
            {
                UnlockedGameIds.Add(gameId);
                HasUsedFreeUnlock = true;
                return true;
            }

            // Normal payment
            if (Balance < cost) return false;

            Balance -= cost;
            UnlockedGameIds.Add(gameId);
            
            // If we unlocked something that wasn't the "free" one (cost > 0), we still mark free as used?
            // Actually, if we pay for one, we consumed an unlock slot.
            // But if cost was 0, HasUsedFreeUnlock handles it.
            // If cost > 0, we just pay.
            
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
