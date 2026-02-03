using System.Collections.Concurrent;
using Swing.Server.classes;

namespace Swing.Server.Services
{
    public class GameStateService
    {
        private readonly ConcurrentDictionary<string, GameState> _states = new();

        public GameState GetState(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                
                userId = "guest"; 
            }

            return _states.GetOrAdd(userId, _ => new GameState());
        }
    }
}
