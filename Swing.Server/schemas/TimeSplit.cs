namespace Swing.Server.classes
{
    public class TimeSwing
    {
        public int lowestTime { get; set; } = 5;
        public int highestTime { get; set; } = 15;
        public float basePrecision { get; set; } = 1f;
        public float precisionMultiplier { get; set; } = 0.9f;
    }
}
