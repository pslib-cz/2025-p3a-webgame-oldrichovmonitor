namespace Swing.Server.classes
{
    public class PrecisionSlider
    {
        public int starterArea { get; set; } = 100;
        public int starterSpeed { get; set; } = 50;
        public float speedMultiplier { get; set; } = 1.2f;
        public float areaMultiplier { get; set; } = 0.9f;

        public float MaxMultiplier { get; set; } = 20.0f;
        public float Difficulty { get; set; } = 2.0f;

        public int newSpeed(int speed)
        {
            int newSpeed = ((int)(speed * speedMultiplier));
            return newSpeed;
        }
        public int newArea(int area)
        {
            int newArea = ((int)(area * areaMultiplier));
            return newArea;
        }
    }
}
