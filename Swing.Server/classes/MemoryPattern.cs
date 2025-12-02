namespace Swing.Server.classes
{
    public class MemoryPattern
    {
        public int startSequence {  get; set; } //length of the first sequence
        public int showSpeed {  get; set; } //speed at which sequence is shown (ms)
        public float speedMultiplier { get; set; } //how much faster is a higher difficulty
        public float multiplierIncrease { get; set; }
        
        public GridCoordinates[] setPattern(int length)
        {
            List<GridCoordinates> coordinates = new List<GridCoordinates>();
            for (int i = 0; i < length; i++)
            {
                int x;
                int y;
                Random random = new Random();
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
