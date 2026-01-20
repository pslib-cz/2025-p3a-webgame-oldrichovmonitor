import React, { useState } from "react";
import Footer from "../components/Footer";
import GridLines from "../components/GridLines";
import { Link } from "react-router-dom";
import BetControls from "../components/BetControls";
import "../css/games/memory.css";

interface Tile {
  id: number;
  status: "active" | "inactive";
  hidden: boolean;
}

const MemoryPattern = () => {
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [pattern, setPattern] = useState<number[]>([]);

  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [patternLength, setPatternLength] = useState(3);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [roundOver, setRoundOver] = useState(false);

  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [win, setWin] = useState<number>(0);

  const [grid, setGrid] = useState<Tile[]>(
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      status: "inactive",
      hidden: true,
    })),
  );

  const startGame = async () => {
    if (isPlaying && !roundOver) return;

    setIsPlaying(true);
    setRoundOver(false);
    setWin(0);
    setPatternLength(3);
    setUserSequence([]);

    fetchAndPlayPattern(3);
  };

  const continueGame = () => {
    setRoundOver(false);
    setUserSequence([]);
    const newLength = patternLength + 1;
    setPatternLength(newLength);
    fetchAndPlayPattern(newLength);
  };

  const fetchAndPlayPattern = async (length: number) => {
    setIsUserTurn(false);
    try {
      const response = await fetch(
        `/api/MemoryPattern/GeneratePattern?length=${length}`,
      );
      const data = await response.json();
      setPattern(data);
      playPattern(data);
    } catch (error) {
      console.error("Failed to fetch pattern", error);
      setIsPlaying(false);
    }
  };

  const getMultiplier = async (length: number) => {
    const response = await fetch(
      `/api/MemoryPattern/Multiplier?length=${length}`,
    );
    const multiplier = await response.json();
    return multiplier;
  };

  const playPattern = (currentPattern: number[]) => {
    setTimeout(() => {
      currentPattern.forEach((idx, i) => {
        setTimeout(() => {
          setHighlighted(idx);
          setTimeout(() => setHighlighted(null), 400);
        }, i * 600);
      });

      setTimeout(
        () => {
          setIsUserTurn(true);
        },
        currentPattern.length * 600 + 200,
      );
    }, 500);
  };

  const handleTileClick = async (index: number) => {
    if (!isPlaying || !isUserTurn || roundOver) return;

    setHighlighted(index);
    setTimeout(() => setHighlighted(null), 200);

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    const currentIndex = newUserSequence.length - 1;

    if (pattern[currentIndex] !== index) {
      setIsPlaying(false);
      setIsUserTurn(false);
      setWin(0);
      setRoundOver(false);
      alert("Wrong pattern! You lost.");
      return;
    }

    if (newUserSequence.length === pattern.length) {
      setIsUserTurn(false);
      setRoundOver(true);

      const multiplier = await getMultiplier(patternLength);
      setWin(Math.floor(betAmount * multiplier));
    }
  };

  const cashOut = () => {
    setIsPlaying(false);
    setRoundOver(false);
    setIsUserTurn(false);
  };

  return (
    <div className="memory-page page">
      <GridLines />
      <header className="games__header">
        <div className="page__section header__content-wrapper game-page__header-content-wrapper">
          <img
            className="logo hide-on-mobile"
            src="/images/logo.png"
            alt="Logo"
            width={140}
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
          <h1 className="game-title">Memory Pattern Crack</h1>
          <p className="subtitle">Watch the sequence, then repeat it</p>
        </div>
        <div className="game__wrapper">
          <div className="grid-container grid-container--memmory">
            {grid.map((tile, index) => (
              <div
                key={tile.id}
                onClick={() => handleTileClick(index)}
                className={index === highlighted ? "tile--highlighted" : ""}
                style={{ cursor: isUserTurn ? "pointer" : "default" }}
              ></div>
            ))}
          </div>
          <BetControls
            balance={balance}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            isPlaying={isPlaying}
            onStart={startGame}
            onCashOut={cashOut}
            cashOutLabel="STOP"
            winAmount={win}
            isCashingOut={false}
            betColor="red"
          />
        </div>
      </main>

      <div className="game-controls">
        <button
          onClick={() => setBetAmount(betAmount - 10)}
          disabled={isPlaying}
        >
          -
        </button>
        <button disabled={isPlaying}>Bet Amount: {betAmount}</button>
        <button
          onClick={() => setBetAmount(betAmount + 10)}
          disabled={isPlaying}
        >
          +
        </button>

        {!isPlaying ? (
          <>
            <button onClick={startGame}>Bet</button>
            {win > 0 && <p>Last Win: {win}</p>}
          </>
        ) : roundOver ? (
          <>
            <p>Current Win: {win}</p>
            <button onClick={continueGame}>
              Next: (Length {patternLength + 1})
            </button>
            <button onClick={cashOut}>Cash Out</button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default MemoryPattern;
