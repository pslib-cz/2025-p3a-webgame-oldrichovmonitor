import { useState, useEffect } from "react";
import bombSound from "../assets/sounds/bomb.mp3";
import Footer from "../components/Footer";
import GridLines from "../components/GridLines";
import BetControls from "../components/BetControls";

interface Tile {
  id: number;
  status: "mine" | "diamond";
  hidden: boolean;
}
const clickSound = new Audio(
  "https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3",
);
const gemSound = new Audio(
  "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3",
);
const boomSound = new Audio(bombSound);
import gemSoundUrl from "../assets/sounds/gem.mp3";
import { Link } from "react-router-dom";
import { useBalance } from "../context/BalanceContext";
const winSound = new Audio(gemSoundUrl);

clickSound.volume = 0.2;
gemSound.volume = 0.3;
boomSound.volume = 0.3;
winSound.volume = 0.4;

const MinesDimonds = () => {
  const { balance, setBalance, setLevel } = useBalance();
  const [minesCount, setMinesCount] = useState(2);
  const [betAmount, setBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openedTiles, setOpenedTiles] = useState(0);
  const [nextMultiplier, setNextMultiplier] = useState(0);
  const [win, setWin] = useState<number>(0);
  const [grid, setGrid] = useState<Tile[]>(
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      status: "diamond",
      hidden: true,
    })),
  );

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/Game/Status");
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
        setLevel(data.level);
      }
    } catch (error) {
      console.error("Failed to fetch game status", error);
    }
  };

  const startGame = async () => {
    if (isPlaying) return;
    if (betAmount > balance) {
      alert("Insufficient balance!");
      return;
    }

    try {
      const res = await fetch(
        `/api/Game/Bet?amount=${betAmount}&gameId=minesdimonds`,
        {
          method: "POST",
        },
      );

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setBalance(data.newBalance);

          clickSound.currentTime = 0;
          clickSound.play();
          setIsPlaying(true);
          setOpenedTiles(0);
          setWin(0);
          setGrid(
            Array.from({ length: 25 }, (_, i) => ({
              id: i,
              status: "diamond",
              hidden: true,
            })),
          );

          await fetch(`/api/MinePattern/StartGame/${minesCount}`);
        }
      } else {
        alert("Bet failed");
      }
    } catch (error) {
      console.error("Bet error", error);
    }
  };
  const getMultiplier = async (openedTiles: number) => {
    const response = await fetch(
      `/api/MinePattern/Multiplier?openedTiles=${openedTiles}&mines=${minesCount}`,
    );
    const multiplier = await response.json();
    return multiplier;
  };

  const cashOut = async () => {
    if (!isPlaying) return;
    winSound.currentTime = 0;
    winSound.play();
    setIsPlaying(false);
    setOpenedTiles(0);
    setNextMultiplier(0);

    try {
      if (win > 0) {
        await fetch(`/api/Game/Win?amount=${win}`, { method: "POST" });
      }
      await fetchStatus();
    } catch (error) {
      console.error("Cashout failed", error);
    }
  };

  const handleTileClick = async (index: number) => {
    if (!isPlaying || !grid[index].hidden) return;
    clickSound.currentTime = 0;
    clickSound.play();
    const response = await fetch(`/api/MinePattern/Reveal?index=${index}`);
    const data = await response.json();

    const newGrid = [...grid];
    newGrid[index].hidden = false;
    newGrid[index].status = data.isMine ? "mine" : "diamond";
    setGrid(newGrid);

    if (data.isMine) {
      boomSound.currentTime = 0;
      boomSound.play();
      setIsPlaying(false);
      setWin(0);
    } else {
      gemSound.currentTime = 0;
      gemSound.play();
      const newOpened = openedTiles + 1;
      setOpenedTiles(newOpened);
      const multiplier = await getMultiplier(newOpened);
      setNextMultiplier(await getMultiplier(newOpened + 1));
      setWin(betAmount * multiplier);
    }
  };
  return (
    <div className="mines-dimonds-page page">
      <GridLines />
      <header className="mines-diamonds__header">
        <div className="page__section header__content-wrapper game-page__header-content-wrapper">
          <img
            className="logo hide-on-mobile"
            src="/images/logo.png"
            alt="Logo"
            width={140}
            /* height={112} */
          />

          <div className="header__nav game-page__nav">
            <div className="balance-info balance-info--header header__balance">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M2 5H22V20H2V5ZM20 18V7H4V18H20ZM17 8C17 8.53043 17.2107 9.03914 17.5858 9.41421C17.9609 9.78929 18.4696 10 19 10V15C18.4696 15 17.9609 15.2107 17.5858 15.5858C17.2107 15.9609 17 16.4696 17 17H7C7 16.4696 6.78929 15.9609 6.41421 15.5858C6.03914 15.2107 5.53043 15 5 15V10C5.53043 10 6.03914 9.78929 6.41421 9.41421C6.78929 9.03914 7 8.53043 7 8H17ZM17 13V12C17 10.9 16.33 10 15.5 10C14.67 10 14 10.9 14 12V13C14 14.1 14.67 15 15.5 15C16.33 15 17 14.1 17 13ZM15.5 11C15.6326 11 15.7598 11.0527 15.8536 11.1464C15.9473 11.2402 16 11.3674 16 11.5V13.5C16 13.6326 15.9473 13.7598 15.8536 13.8536C15.7598 13.9473 15.6326 14 15.5 14C15.3674 14 15.2402 13.9473 15.1464 13.8536C15.0527 13.7598 15 13.6326 15 13.5V11.5C15 11.3674 15.0527 11.2402 15.1464 11.1464C15.2402 11.0527 15.3674 11 15.5 11ZM13 13V12C13 10.9 12.33 10 11.5 10C10.67 10 10 10.9 10 12V13C10 14.1 10.67 15 11.5 15C12.33 15 13 14.1 13 13ZM11.5 11C11.6326 11 11.7598 11.0527 11.8536 11.1464C11.9473 11.2402 12 11.3674 12 11.5V13.5C12 13.6326 11.9473 13.7598 11.8536 13.8536C11.7598 13.9473 11.6326 14 11.5 14C11.3674 14 11.2402 13.9473 11.1464 13.8536C11.0527 13.7598 11 13.6326 11 13.5V11.5C11 11.3674 11.0527 11.2402 11.1464 11.1464C11.2402 11.0527 11.3674 11 11.5 11ZM8 15H9V10H8L7 10.5V11.5L8 11V15Z"
                  fill="#EBB30B"
                />
              </svg>
              <p className="subtitle ibmplexmono white">
                Balance: {balance.toFixed(2)}$
              </p>
            </div>
            <Link
              to="/homepage"
              className="subtitle hoverable balance--order-switch"
            >
              Exit to Arcade
            </Link>
          </div>
        </div>
      </header>
      <main>
        <div className="header__title-wrapper page__section game-page__header-title-wrapper">
          <h1 className="game-title">Mines & Diamonds</h1>
          <p className="subtitle">Avoid mines and uncover shining diamonds.</p>
        </div>
        <div className="mines-game__wrapper">
          <div className="mines-buttons">
            <label
              className="mines-button mines-button__mines-count mines-button__text"
              style={{
                opacity: isPlaying ? 0.5 : 1,
                pointerEvents: isPlaying ? "none" : "auto",
              }}
            >
              MINES:&nbsp;
              <select
                className="mines-button__select"
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
            <label className="mines-button mines-button__multiplier">
              <div className="mines-button__icon-wrapper">
                <p className="mines-button__text">MULTIPLIER:</p>
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
              >
                {!tile.hidden &&
                  (tile.status === "mine" ? (
                    <img src="/images/bomba.svg" alt="bomba" />
                  ) : (
                    <img src="/images/diamand.svg" alt="diamand" />
                  ))}
              </div>
            ))}
          </div>

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
      </main>
      <Footer />
    </div>
  );
};

export default MinesDimonds;
