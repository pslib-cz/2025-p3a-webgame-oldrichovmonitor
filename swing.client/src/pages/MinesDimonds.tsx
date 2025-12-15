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
      const response = await fetch(`https://localhost:54657/api/MinePattern/generate/${minesCount}`);
     
      if (!response.ok) {
        throw new Error("Chyba při komunikaci se serverem");
      }
      {console.log(JSON.stringify(response))}
      const mineCoordinates: Coordinates[] = await response.json();
  };
  

  const handleTileClick = () => {};
  return (
    <div className="grid-container">
      {grid.map((tile, index) => (
        <div key={tile.id} onClick={handleTileClick} className=""></div>
      ))}
    </div>
  );
};

export default MinesDimonds;
