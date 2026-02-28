import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import GridLines from "../components/GridLines";
import GameHeader from "../components/GameHeader";
import BetControls from "../components/BetControls";
import { useBalance } from "../context/BalanceContext";
import { useSound } from "../context/SoundContext";

interface Tile {
  id: number;
  status: "mine" | "diamond";
  hidden: boolean;
}

const MinesDimonds = () => {
  const { balance, unlockedGames, fetchUser, updateUser } = useBalance();
  const { playClick, playSuccess, playLose, playWin } = useSound();
  const [minesCount, setMinesCount] = useState(2);
  const [betAmount, setBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openedTiles, setOpenedTiles] = useState(0);
  const [nextMultiplier, setNextMultiplier] = useState(0);
  const [win, setWin] = useState<number>(0);
  const [toast, setToast] = useState<string | null>(null);
  const [minePositions, setMinePositions] = useState<Set<number>>(new Set());
  const [grid, setGrid] = useState<Tile[]>(
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      status: "diamond",
      hidden: true,
    })),
  );

  useEffect(() => {
    fetchUser();
  }, []);

  // Calculate multiplier locally based on opened tiles and mines count
  const calcMultiplier = (opened: number, mines: number) => {
    if (opened === 0) return 0;
    let mult = 1;
    const totalTiles = 25;
    for (let i = 0; i < opened; i++) {
      mult *=
        totalTiles - mines - i > 0 ? totalTiles / (totalTiles - mines - i) : 1;
    }
    return Math.round(mult * 100) / 100;
  };

  const startGame = async () => {
    if (isPlaying) return;
    if (betAmount > balance) {
      setToast("Insufficient balance!");
      playLose();
      return;
    }

    // Deduct bet locally and save to backend
    const newBalance = balance - betAmount;
    await updateUser(newBalance, unlockedGames);

    setToast(null);
    playClick();
    setIsPlaying(true);
    setOpenedTiles(0);
    setWin(0);
    setNextMultiplier(0);
    setGrid(
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        status: "diamond",
        hidden: true,
      })),
    );

    // Generate mine positions locally
    const positions = new Set<number>();
    while (positions.size < minesCount) {
      positions.add(Math.floor(Math.random() * 25));
    }
    setMinePositions(positions);
  };

  const cashOut = async () => {
    if (!isPlaying) return;
    playWin();
    setIsPlaying(false);
    setOpenedTiles(0);
    setNextMultiplier(0);

    if (win > 0) {
      const newBalance = balance + win;
      await updateUser(newBalance, unlockedGames);
    }
  };

  const handleTileClick = async (index: number) => {
    if (!isPlaying || !grid[index].hidden) return;
    playClick();

    const isMine = minePositions.has(index);

    const newGrid = [...grid];
    newGrid[index].hidden = false;
    newGrid[index].status = isMine ? "mine" : "diamond";
    setGrid(newGrid);

    if (isMine) {
      playLose();
      setIsPlaying(false);
      setWin(0);
    } else {
      playSuccess();
      const newOpened = openedTiles + 1;
      setOpenedTiles(newOpened);
      const multiplier = calcMultiplier(newOpened, minesCount);
      setNextMultiplier(calcMultiplier(newOpened + 1, minesCount));
      setWin(Math.round(betAmount * multiplier * 100) / 100);
    }
  };
  return (
    <div className="mines-dimonds-page page">
      <GridLines />
      <GameHeader
        title="Mines & Diamonds"
        subtitle="Avoid mines and uncover shining diamonds."
      />
      <main>
        <div className="mines-game__wrapper">
          <div className="mines-buttons">
            <label
              className={`mines-button mines-button__mines-count mines-button__text ${isPlaying ? "mines-label--disabled" : ""}`}
            >
              MINES:&nbsp;
              <select
                className="mines-button__select"
                value={minesCount}
                onChange={(e) => setMinesCount(Number(e.target.value))}
                disabled={isPlaying}
                aria-label="Number of mines"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </label>
            <label className="mines-button mines-button__multiplier">
              <div className="mines-button__icon-wrapper">
                <p className="mines-button__text">NEXT MULTIPLIER:</p>
              </div>
              <p className="mines-button__subtext">{nextMultiplier}x</p>
            </label>
          </div>
          <div className="grid-container grid-container--mines">
            {grid.map((tile, index) => (
              <div
                className="tile"
                key={tile.id}
                onClick={() => handleTileClick(index)}
                role="button"
                aria-label={
                  tile.hidden
                    ? `Tile ${index + 1}, hidden`
                    : `Tile ${index + 1}, ${tile.status}`
                }
              >
                {!tile.hidden &&
                  (tile.status === "mine" ? (
                    <img src="/images/bomba.svg" alt="Mine" />
                  ) : (
                    <img src="/images/diamand.svg" alt="Diamond" />
                  ))}
              </div>
            ))}
          </div>

          <div className="mines__game-nav">
            {toast && (
              <div className="game-toast game-toast--error" role="alert">
                {toast}
              </div>
            )}
            <BetControls
              balance={balance}
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              isPlaying={isPlaying}
              onStart={startGame}
              onCashOut={() => {
                if (openedTiles > 0) cashOut();
              }}
              cashOutLabel={openedTiles > 0 ? "CASH OUT" : "BET"}
              winAmount={win}
              isCashingOut={openedTiles > 0}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MinesDimonds;
