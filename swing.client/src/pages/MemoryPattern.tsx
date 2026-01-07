import React, { useState } from "react";
import Footer from "../components/Footer";
import GridLines from "../components/GridLines";

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
        `/api/MemoryPattern/GeneratePattern?length=${length}`
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
      `/api/MemoryPattern/Multiplier?length=${length}`
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

      setTimeout(() => {
        setIsUserTurn(true);
      }, currentPattern.length * 600 + 200);
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
    <>
      <div className="grid-container grid-container--memmory">
        {grid.map((tile, index) => (
          <div
            key={tile.id}
            onClick={() => handleTileClick(index)}
            className={
              index === highlighted ? "tile tile--highlighted" : "tile"
            }
            style={{ cursor: isUserTurn ? "pointer" : "default" }}
          ></div>
        ))}
      </div>

      {!isPlaying ? (
        <>
          <button onClick={startGame}>Bet</button>
          <button>Bet Amount: {betAmount}</button>
          <button onClick={() => setBetAmount(betAmount - 10)}>-</button>
          <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
          {win > 0 && <p>Last Win: {win}</p>}
        </>
      ) : (
        <>
          {roundOver ? (
            <div className="game-controls">
              <p>Level Complete! Current Win: {win}</p>
              <button onClick={continueGame}>
                Next Level (Length {patternLength + 1})
              </button>
              <button onClick={cashOut}>Cash Out</button>
            </div>
          ) : (
            <p>{isUserTurn ? "Your Turn!" : "Watch the pattern..."}</p>
          )}
        </>
      )}
    </>
  );
};

export default MemoryPattern;
