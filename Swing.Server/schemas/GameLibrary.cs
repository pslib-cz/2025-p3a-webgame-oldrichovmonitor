public class GameDefinition
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public int MinLevel { get; set; }
    public required string Route { get; set; }
}

public static class GameLibrary
{
    public static readonly List<GameDefinition> AllGames = new List<GameDefinition>
    {
        new GameDefinition
        {
            Id = "timesplit",
            Name = "TimeSplit",
            Description = "Hit the exact target moment before time runs completely out.",
            MinLevel = 1,
            Route = "/timesplit"
        },
        new GameDefinition
        {
            Id = "memorypattern",
            Name = "Memory Pattern Crack",
            Description = "Repeat increasingly complex flashing sequences without failing even one step.",
            MinLevel = 2,
            Route = "/memmorypattern"
        },
        new GameDefinition
        {
            Id = "slider",
            Name = "Precision Slider",
            Description = "Stop the moving slider exactly inside the shrinking target zone.",
            MinLevel = 3,
            Route = "/precisionslider"
        },
        new GameDefinition
        {
            Id = "minesdimonds",
            Name = "Mines & Dimonds",
            Description = "Reveal diamonds while avoiding hidden mines with perfect judgment.",
            MinLevel = 4,
            Route = "/mines"
        }
    };
}