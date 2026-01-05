import React, { useState } from "react";

interface Tile {
  id: number;
  status: "active" | "inactive";
  hidden: boolean;
}

const MemoryPattern = () => {
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [pattern, setPattern] = useState<number[]>([])
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [win, setWin] = useState<number>(0);
  const [grid, setGrid] = useState<Tile[]>(
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      status: "inactive",
      hidden: true,
    }))
  );

  const startGame = async () => {
    const response = await fetch(`/api/MemoryPattern/GeneratePattern?length=4`);
    const data = await response.json();
    playPattern(data);
  };

  const playPattern = (pattern: number[]) => {
    pattern.forEach((idx, i) => {
      setTimeout(() => {
        setHighlighted(idx);
        setTimeout(() => setHighlighted(null), 500);
      }, i * 800); 
    });
  };

  const handleTileClick = (index: number) => {
    const newGrid = [...grid];
    newGrid[index].hidden = false;
    setGrid(newGrid);
  };

  return (
    <>
      <div className="grid-container grid-container--memmory">
        {grid.map((tile, index) => (
          <div
            key={tile.id}
            onClick={() => handleTileClick(index)}
            className={index === highlighted ? "tile tile--highlighted" : "tile"}
          >
          </div>
        ))}
      </div>

      <button onClick={() => startGame()} disabled={isPlaying}>
        bet
      </button>
      <button>Bet Amount: {betAmount}</button>
      <button onClick={() => setBetAmount(betAmount - 10)}>-</button>
      <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
      <p>You win: {win}</p>
    </>
  );
};

export default MemoryPattern;
