namespace Swing.Server.classes
{
    public class MemoryPattern
    {
        private List<int> _coordinates = new List<int>();

        public int startSequence { get; set; } = 3;
        public int showSpeed { get; set; } = 300;
        public float speedMultiplier { get; set; } = 1.1f;
        public float multiplierIncrease { get; set; } = 1.2f;

        public int[] setPattern(int length, bool newGame = false)
        {
            // Maximální délka patternu je 16 (počet políček), abychom předešli nekonečné smyčce při hledání unikátních čísel
            if (length > 16) length = 16;

            if (newGame)
            {
                _coordinates.Clear();
            }

            // Použijeme Random.Shared pro lepší náhodnost (new Random() v rychlém sledu může generovat stejně)
            
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
