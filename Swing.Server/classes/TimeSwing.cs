namespace Swing.Server.classes
{
    public class TimeSwing
    {
        public TimeSwing(int easySpeed, int mediumSpeed, int hardSpeed, float easyMultiplier, float mediumMultiplier, float hardMultiplier)
        {
            this.easySpeed = easySpeed;
            this.mediumSpeed = mediumSpeed;
            this.hardSpeed = hardSpeed;
            this.easyMultiplier = easyMultiplier;
            this.mediumMultiplier = mediumMultiplier;
            this.hardMultiplier = hardMultiplier;
        }

        public int easySpeed {  get; set; }
        public int mediumSpeed {  get; set; }
        public int hardSpeed { get; set; }
        public float easyMultiplier { get; set; }
        public float mediumMultiplier { get; set; }
        public float hardMultiplier { get; set; }

    }
}
