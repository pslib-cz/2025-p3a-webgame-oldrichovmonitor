namespace Swing.Server.classes
{
    public class MinePattern
    {
        public GridCoordinates[] placement(int mines, int diamonds)
        {
            List<GridCoordinates> result = new List<GridCoordinates>();
            Random random = new Random();
            while (mines > 0)
            {
                int x;
                int y;
                bool isTaken = false;
                
                x = random.Next(0, 5);
                y = random.Next(0, 5);
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
                
                x = random.Next(0, 5);
                y = random.Next(0, 5);
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
            float multiplier = 1.0f;
            for (int i = 0; i < openedTiles; i++)
            {
                multiplier *= (25.0f - i) / (25.0f - mines - i);
            }
            return multiplier;
        }
        
    }
}
