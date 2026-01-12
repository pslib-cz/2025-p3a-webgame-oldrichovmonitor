namespace Swing.Server.classes
{
    public class MemoryPattern
    {


        public int startSequence { get; set; } = 3;
        public int showSpeed { get; set; } = 300;
        public float speedMultiplier { get; set; } = 1.1f;
        public float multiplierIncrease { get; set; } = 1.2f;

        public GridCoordinates[] setPattern(int length)
        {
            Random random = new Random();
            List<GridCoordinates> coordinates = new List<GridCoordinates>();
            for (int i = 0; i < length; i++)
            {
                int x;
                int y;

                x = random.Next(0, 3);
                y = random.Next(0, 3);
                coordinates.Add(new GridCoordinates(x, y));
            }
            return coordinates.ToArray();
        }
        public float setMultiplier(float currentValue)
        {
            float nextMultiplier = multiplierIncrease * currentValue;
            return nextMultiplier;
        }

    }
}
