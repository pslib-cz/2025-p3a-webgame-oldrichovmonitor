namespace Swing.Server.classes
{
    public class MemoryPattern
    {
        private List<int> _coordinates = new List<int>();

        public int startSequence { get; set; } = 3;
        public int showSpeed { get; set; } = 300;
        public float speedMultiplier { get; set; } = 1.1f;
        public float multiplierIncrease { get; set; } = 1.2f;

        public List<int> GeneratePattern()
        {
            List<int> pattern = new();
            
            while (pattern.Count < 16)
            {
                int nextNum = Random.Shared.Next(1, 17);
                if (!pattern.Contains(nextNum))
                {
                    pattern.Add(nextNum);
                }
            }
            return pattern;
        }
        public int[] setPattern(int length, bool newGame = false)
        {
            if (length > 16) length = 16;

            if (newGame)
            {
                _coordinates.Clear();
            }

            
            while (_coordinates.Count < length)
            {
                int x = Random.Shared.Next(0, 16);
                if (!_coordinates.Contains(x))
                {
                    _coordinates.Add(x);
                }
            }
            return _coordinates.ToArray();
        }
        public float setMultiplier(float currentValue)
        {
            float nextMultiplier = multiplierIncrease * currentValue;
            return nextMultiplier;
        }

    }
}
