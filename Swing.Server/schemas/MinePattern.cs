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

            const int totalTiles = 25;

            float survival = 1f;
            for (int i = 0; i < openedTiles; i++)
            {
                survival *= (totalTiles - mines - i) / (float)(totalTiles - i);
            }

            float realDanger = 1f - survival;

            float safeTiles = totalTiles - mines;
            float inertia = safeTiles * 0.15f;
            float clickFactor = openedTiles / (openedTiles + inertia);

            float delayedDanger = realDanger * clickFactor;

            const float flipDanger = 0.33f;
            const float startMult = 0.3f;   // ⬅️ lower start to get 0.32-ish
            const float maxMult = 4.0f;

            float t = delayedDanger / flipDanger;

            float multiplier;

            if (t < 1f)
            {
                // 🚀 FAST early growth
                float eased = (float)Math.Sqrt(t);
                multiplier = startMult + (1f - startMult) * eased;
            }
            else
            {
                float excess = (t - 1f) / 2f;
                if (excess > 1f) excess = 1f;

                multiplier = 1f + (maxMult - 1f) * excess;
            }

            return multiplier;
        }

    }


}
