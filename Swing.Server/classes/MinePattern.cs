namespace Swing.Server.classes
{
    public class MinePattern
    {
        public GridCoordinates[] placement(int mines, int diamonds)
        {
            List<GridCoordinates> result = new List<GridCoordinates>();
            
            while (mines > 0)
            {
                int x;
                int y;
                bool isTaken = false;
                Random random = new Random();
                x = random.Next(0, 4);
                y = random.Next(0, 4);
                for (int i = 0; i < result.Count; i++)
                {
                    if(x == result[i].X && y == result[i].Y)
                    {
                        isTaken = true;
                    }
                }
                if (!isTaken)
                {
                    result.Add(new GridCoordinates(x, y));
                    mines--;
                }
                isTaken = false;
            }
            while (diamonds > 0)
            {
                int x;
                int y;
                bool isTaken = false;
                Random random = new Random();
                x = random.Next(0, 4);
                y = random.Next(0, 4);
                for (int i = 0; i < result.Count; i++)
                {
                    if (x == result[i].X && y == result[i].Y)
                    {
                        isTaken = true;
                    }
                }
                if (!isTaken)
                {
                    result.Add(new GridCoordinates(x, y));
                    diamonds--;
                }
                isTaken = false;
            }
            return result.ToArray();
        }
        public float returnMultiplier(int openedTiles, int mines)
        {
            int remainingTiles = 25 - openedTiles;
            int remainingSafe = remainingTiles - mines;
            float probability = remainingTiles / remainingSafe;
            
            return probability;
        }
    }
}
