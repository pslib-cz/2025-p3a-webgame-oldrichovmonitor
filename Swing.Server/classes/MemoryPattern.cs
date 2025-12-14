namespace Swing.Server.classes
{
    public class MemoryPattern
    {


        public int startSequence { get; set; } = 3; //length of the first sequence
        public int showSpeed { get; set; } = 300; //speed at which sequence is shown (ms)
        public float speedMultiplier { get; set; } = 1.1f; //how much faster is a higher difficulty
        public float multiplierIncrease { get; set; } = 1.2f; //how much higher is the multiplier for each correct sequence

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
