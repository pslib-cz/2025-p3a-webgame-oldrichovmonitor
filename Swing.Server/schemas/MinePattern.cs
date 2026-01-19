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
            int totalTiles = 25;
            int safeTiles = totalTiles - mines;

            if (openedTiles <= 0 || safeTiles <= 0)
                return 1f;

            // Determine max multiplier based on mines
            float minMultiplier = 1f; // base multiplier
            float maxMultiplier = 1f + 2f * mines; // tweak factor to scale with mines

            // Use a smooth exponential growth for multiplier
            float progress = (float)openedTiles / safeTiles; // 0 -> 1
            float multiplier = 1f + (maxMultiplier - 1f) * (float)Math.Pow(progress, 1.5); // smooth curve

            return multiplier;

        }
    }
}
