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
  const [mineIndices, setMineIndices] = useState<number[]>([]);
  const [openedTiles, setOpenedTiles] = useState(0);
  const [win, setWin] = useState<number>(0);
  const [grid, setGrid] = useState<Tile[]>(
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      status: "diamond",
      hidden: true,
    }))
  );

  const startGame = async () => {
    setIsPlaying(true);
    const response = await fetch(`/api/MinePattern/StartGame/${minesCount}`);
    const data: number[] = await response.json();
    setMineIndices(data);
    console.log(data);
  };
  const getMultiplier = async (openedTiles: number) => {
    const response = await fetch(
      `/api/MinePattern/Multiplier?openedTiles=${openedTiles}&mines=${minesCount}`
    );
    const multiplier = await response.json();
    return multiplier;
  };

  const handleTileClick = async (index: number) => {
    if (!isPlaying) return;
    const response = await fetch(`/api/MinePattern/Reveal?index=${index}`);
    const data = await response.json();

    const newGrid = [...grid];
    newGrid[index].hidden = false;
    newGrid[index].status = data.isMine ? "mine" : "diamond";
    setGrid(newGrid);

    if (data.isMine) {
      alert("Bomba!");
    } else {
      const newOpened = openedTiles + 1;
      setOpenedTiles(newOpened);
      const multiplier = await getMultiplier(newOpened);
      setWin(betAmount * multiplier);
      alert(`Diamant! Multiplier: ${multiplier}`);
    }
  };
  return (
    <>
      <div className="grid-container">
        {grid.map((tile, index) => (
          <div key={tile.id} onClick={() => handleTileClick(index)}>
             {!tile.hidden && (tile.status === "mine" ? <img src="/images/bomba.svg" alt="bomba"/> : <img src="/images/diamand.svg" alt="diamand"/>)}
          </div>
        ))}
      </div>
      <button onClick={() => startGame()}>bet</button>
      <button>Bet Amount: {betAmount}</button>
      <button onClick={() => setBetAmount(betAmount - 10)}>-</button>
      <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
      <button>Pocet sebranych diamantu: {openedTiles}</button>
      <p>You win: {win}</p>
    </>
  );
};

export default MinesDimonds;
