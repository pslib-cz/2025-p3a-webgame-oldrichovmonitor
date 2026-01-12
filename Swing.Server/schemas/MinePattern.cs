namespace Swing.Server.classes
{
    public class MinePattern
    {
        public int[] placement(int mines)
        {
            List<int> result = new List<int>();
            Random random = new Random();
            for(int i = 0; i < mines; i++)
            {
                result.Add(random.Next(0, 24));
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
