import React, { useState } from "react";

interface Tile {
    id: number,
    status: "hidden" | "mine" | "diamond"
}

const MinesDimonds = () => {
  const [minesCount, setMinesCount] = useState(2);
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [grid, setGrid] = useState(
    Array.from({ length: 25 }, (_, i) => ({ id: i, status: "hidden" }))
  );
  const handleTileClick = () =>{
    
  }
  return (
    <div className="grid-container">
      {grid.map((tile, index) => (
        <div key={tile.id} onClick={handleTileClick} className=""></div>
      ))}
    </div>
  );
};

export default MinesDimonds;
