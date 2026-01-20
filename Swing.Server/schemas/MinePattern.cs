using Microsoft.Identity.Client;
using System;

namespace Swing.Server.classes
{
    public class MinePattern
    {
        public int[] placement(int mines)
        {
            if (mines > 25)
                throw new ArgumentException("Mines cannot exceed grid size");

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

            if (openedTiles <= 0)
                return 0f;

            int safeTiles = 25 - mines;

            
            // Survival probability P(k)
            float probability = 1f;

            for (int i = 0; i < openedTiles; i++)
            {
                probability *= (float)(safeTiles - i) / (25 - i);
            }

            // Multiplier with house edge
            float multiplier = (1f - 0.05f) / probability;

            // Optional rounding for UI
            return multiplier / 3f;
        }

    }


}
