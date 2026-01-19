using System;

namespace Swing.Server.classes
{
    public class MinePattern
    {
        public int[] placement(int mines)
        {
            

            HashSet<int> result = new HashSet<int>();
            Random random = new Random();

            while (result.Count < mines)
            {
                result.Add(random.Next(0, 25));
            }

            return result.ToArray();
        }
        public float returnMultiplier(int openedTiles, int mines)
        {
            float multiplier = 1.0f;
            multiplier = openedTiles / mines;
            return multiplier;
        }
        
    }
}
