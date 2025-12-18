import { useState } from "react";

interface Tile {
  id: number;
  status: "mine" | "diamond";
  hidden: boolean;
}

const MinesDimonds = () => {
  const [minesCount, setMinesCount] = useState(2);
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openedTiles, setOpenedTiles] = useState(0);
  const [nextMultiplier, setNextMultiplier] = useState(0);
  const [win, setWin] = useState<number>(0);
  const [grid, setGrid] = useState<Tile[]>(
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      status: "diamond",
      hidden: true,
    }))
  );

  const startGame = async () => {
    if(isPlaying) return
    setIsPlaying(true);
    setOpenedTiles(0);
    setWin(0);
    setGrid(
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        status: "diamond",
        hidden: true,
      }))
    );

    await fetch(`/api/MinePattern/StartGame/${minesCount}`);
    
  };
  const getMultiplier = async (openedTiles: number) => {
    const response = await fetch(
      `/api/MinePattern/Multiplier?openedTiles=${openedTiles}&mines=${minesCount}`
    );
    const multiplier = await response.json();
    return multiplier;
  };

  const cashOut = () =>{

  }

  const handleTileClick = async (index: number) => {
    if (!isPlaying || !grid[index].hidden) return;
    const response = await fetch(`/api/MinePattern/Reveal?index=${index}`);
    const data = await response.json();

    const newGrid = [...grid];
    newGrid[index].hidden = false;
    newGrid[index].status = data.isMine ? "mine" : "diamond";
    setGrid(newGrid);

    if (data.isMine) {
      setIsPlaying(false)
      setWin(0)
    } else {
      const newOpened = openedTiles + 1;
      setOpenedTiles(newOpened);
      const multiplier = await getMultiplier(newOpened);
      setNextMultiplier(await getMultiplier(multiplier));
      setWin(betAmount * multiplier);
    }
  };
  return (
    <>
      <div className="grid-container">
        {grid.map((tile, index) => (
          <div key={tile.id} onClick={() => handleTileClick(index)}>
            {!tile.hidden &&
              (tile.status === "mine" ? (
                <img src="/images/bomba.svg" alt="bomba" />
              ) : (
                <img src="/images/diamand.svg" alt="diamand" />
              ))}
          </div>
        ))}
      </div>
      <button onClick={() => startGame()} disabled={isPlaying}>bet</button>
      <button>Bet Amount: {betAmount}</button>
      <button onClick={() => setBetAmount(betAmount - 10)}>-</button>
      <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
      <label>
        Počet min:&nbsp;
        <select
          value={minesCount}
          onChange={(e) => setMinesCount(Number(e.target.value))}
          disabled={isPlaying}
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </label>
      <button>Pocet sebranych diamantu: {openedTiles}</button>
      <p>You win: {win}</p>
      <p>Next Multiplier: {nextMultiplier}</p>
      <button onClick={()=> cashOut()}>Cash Out</button>
    </>
  );
};

export default MinesDimonds;
