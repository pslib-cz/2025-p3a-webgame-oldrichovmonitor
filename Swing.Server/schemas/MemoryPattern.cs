namespace Swing.Server.classes
{
    public class MemoryPattern
    {


        public int startSequence { get; set; } = 3;
        public int showSpeed { get; set; } = 300;
        public float speedMultiplier { get; set; } = 1.1f;
        public float multiplierIncrease { get; set; } = 1.2f;

        public int[] setPattern(int length)
        {
            Random random = new Random();
            List<int> coordinates = new List<int>();
            for (int i = 0; i < length; i++)
            {
                int x;
                
                
                x = random.Next(0, 15);
                
                coordinates.Add(x);
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
