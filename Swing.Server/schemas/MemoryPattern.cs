namespace Swing.Server.classes
{
    public class MemoryPattern
    {


        public int startSequence { get; set; } = 3; //length of the first sequence
        public int showSpeed { get; set; } = 300; //speed at which sequence is shown (ms)
        public float speedMultiplier { get; set; } = 1.1f; //how much faster is a higher difficulty
        public float multiplierIncrease { get; set; } = 1.2f; //how much higher is the multiplier for each correct sequence

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
