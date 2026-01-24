public class GameDefinition
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
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
            Route = "/timesplit"
        },
        new GameDefinition
        {
            Id = "memorypattern",
            Name = "Memory Pattern Crack",
            Description = "Repeat increasingly complex flashing sequences without failing even one step.",
            Route = "/memmorypattern"
        },
        new GameDefinition
        {
            Id = "slider",
            Name = "Precision Slider",
            Description = "Stop the moving slider exactly inside the shrinking target zone.",
            Route = "/precisionslider"
        },
        new GameDefinition
        {
            Id = "minesdimonds",
            Name = "Mines & Dimonds",
            Description = "Reveal diamonds while avoiding hidden mines with perfect judgment.",
            Route = "/mines"
        }
    };
}