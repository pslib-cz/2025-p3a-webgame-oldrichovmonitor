import React, { useState } from "react";

interface Coordinates {
  x: number;
  y: number;
}

interface Tile {
  id: number;
  status: "mine" | "diamond";
  hidden: boolean;
}

const MinesDimonds = () => {
  const [minesCount, setMinesCount] = useState(2);
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [grid, setGrid] = useState<Tile[]>(
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      status: "diamond",
      hidden: true,
    }))
  );

  const startGame = async () => {
      const response = await fetch(`/api/MinePattern/StartGame/10`);
      const data = await response.json();
      console.log(data);
  };

  const handleTileClick = () => {};
  return (
    <>
      <div className="grid-container">
        {grid.map((tile, index) => (
          <div key={tile.id} onClick={handleTileClick} className=""></div>
        ))}
      </div>
      <button onClick={()=> startGame()}>bet</button>
    </>
  );
};

export default MinesDimonds;
