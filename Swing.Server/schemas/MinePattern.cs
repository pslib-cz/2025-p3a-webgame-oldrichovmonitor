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
            float risk = (float)(25 - openedTiles) / mines;
            return risk;
        }

    }


}
