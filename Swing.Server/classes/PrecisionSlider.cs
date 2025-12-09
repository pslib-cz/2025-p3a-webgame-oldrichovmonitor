namespace Swing.Server.classes
{
    public class PrecisionSlider
    {
        public int starterArea {  get; set; }
        public int starterSpeed { get; set; }
        public float speedMultiplier { get; set; }
        public float areaMultiplier { get; set; }
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
