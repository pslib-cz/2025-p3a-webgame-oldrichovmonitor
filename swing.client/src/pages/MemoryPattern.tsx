import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import GridLines from "../components/GridLines";
import GameHeader from "../components/GameHeader";
import BetControls from "../components/BetControls";
import "../css/games/memory.css";
import { useBalance } from "../context/BalanceContext";
import { useSound } from "../context/SoundContext";

interface Tile {
  id: number;
  status: "active" | "inactive";
  hidden: boolean;
}

const MULTIPLIERS = [1.01, 1.1, 1.2, 1.5, 2.1, 3.2, 5.0, 8.5, 15, 32];

const MemoryPattern = () => {
  const { balance, unlockedGames, fetchUser, updateUser } = useBalance();
  const { playClick, playSuccess, playLose, playWin } = useSound();
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [pattern, setPattern] = useState<number[]>([]);

  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [patternLength, setPatternLength] = useState(3);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [roundOver, setRoundOver] = useState(false);
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [win, setWin] = useState<number>(0);
  const [toast, setToast] = useState<string | null>(null);
  const [memoryConfig, setMemoryConfig] = useState({
    patternLength: 3,
    speedMs: 600,
  });

  const grid: Tile[] = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    status: "inactive",
    hidden: true,
  }));

  useEffect(() => {
    fetchUser();
    // Fetch memory config from backend
    fetch("/api/games/memory")
      .then((res) => res.json())
      .then((data) => {
        setMemoryConfig({
          patternLength: data.patternLength,
          speedMs: data.speedMs,
        });
        setPatternLength(data.patternLength);
      })
      .catch((err) => console.error("Failed to fetch memory config", err));
    if (!isPlaying) {
      setRoundOver(false);
      setWin(0);
    }
  }, []);

  const startGame = async () => {
    if (isPlaying && !roundOver) return;

    if (betAmount > balance) {
      setToast("Insufficient balance!");
      playLose();
      return;
    }

    // Deduct bet locally and save to backend
    const newBalance = balance - betAmount;
    await updateUser(newBalance, unlockedGames);

    setIsPlaying(true);
    setRoundOver(false);
    setWin(0);
    setPatternLength(memoryConfig.patternLength);
    setUserSequence([]);

    generateAndPlayPattern(memoryConfig.patternLength);
  };

  const continueGame = () => {
    setRoundOver(false);
    setUserSequence([]);
    const newLength = patternLength + 1;
    setPatternLength(newLength);

    generateAndPlayPattern(newLength);
  };

  // Generate pattern locally
  const generateAndPlayPattern = (length: number) => {
    setIsUserTurn(false);
    const newPattern: number[] = [];
    for (let i = 0; i < length; i++) {
      newPattern.push(Math.floor(Math.random() * 16));
    }
    setPattern(newPattern);
    playPattern(newPattern);
  };

  const playPattern = (currentPattern: number[]) => {
    const speed = memoryConfig.speedMs;
    setTimeout(() => {
      currentPattern.forEach((idx, i) => {
        setTimeout(() => {
          setHighlighted(idx);
          setTimeout(() => setHighlighted(null), speed * 0.67);
        }, i * speed);
      });

      setTimeout(
        () => {
          setIsUserTurn(true);
        },
        currentPattern.length * speed + 200,
      );
    }, 500);
  };

  const handleTileClick = async (index: number) => {
    if (!isPlaying || !isUserTurn || roundOver) return;

    playClick();
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
      setToast("Wrong pattern! You lost.");
      playLose();
      return;
    }

    if (newUserSequence.length === pattern.length) {
      setIsUserTurn(false);
      setRoundOver(true);
      playSuccess();

      const multiplier =
        MULTIPLIERS[patternLength - memoryConfig.patternLength] ?? 1;
      setWin(Math.floor(betAmount * multiplier));
    }
  };

  const handleCashOut = async () => {
    if (!roundOver) return;

    try {
      if (win > 0) {
        const newBalance = balance + win;
        await updateUser(Math.round(newBalance), unlockedGames);
        playWin();
      }
      await fetchUser();
    } catch (error) {
      console.error("Cashout failed", error);
    } finally {
      setIsPlaying(false);
      setRoundOver(false);
      setIsUserTurn(false);
      setWin(0);
      setPatternLength(memoryConfig.patternLength);
      setUserSequence([]);
    }
  };

  return (
    <div className="memory-page page">
      <GridLines />
      <GameHeader
        title="Memory Pattern Crack"
        subtitle="Watch the sequence, then repeat it"
      />
      <main>
        <div className="game__wrapper memory-game__wrapper">
          <div className="memory-multipliers">
            {MULTIPLIERS.map((mul, i) => {
              const isActive = i === patternLength - 3;
              const isPassed = i < patternLength - 3;
              return (
                <div
                  key={i}
                  className={`memory-multiplier ${isActive ? "active" : ""} ${isPassed ? "passed" : ""}`}
                >
                  {mul}x
                </div>
              );
            })}
          </div>

          <div className="grid-container grid-container--memmory">
            {grid.map((tile, index) => (
              <div
                key={tile.id}
                onClick={() => handleTileClick(index)}
                className={`${index === highlighted ? "tile--highlighted" : ""} ${isUserTurn ? "tile--clickable" : ""}`}
                role="button"
                aria-label={`Memory tile ${index + 1}`}
              ></div>
            ))}
          </div>

          {!isPlaying ? (
            <>
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
                onStart={() => {
                  setToast(null);
                  startGame();
                }}
                onCashOut={() => {}}
                winAmount={win}
                isCashingOut={false}
                betColor="red"
              />
            </>
          ) : (
            <div className="in-game-controls">
              {roundOver ? (
                <>
                  <button
                    className="memory-btn continue-btn"
                    onClick={() => {
                      playClick();
                      continueGame();
                    }}
                    aria-label="Continue to next round"
                  >
                    CONTINUE
                  </button>
                  <button
                    className="memory-btn cashout-btn"
                    onClick={() => {
                      playClick();
                      handleCashOut();
                    }}
                    aria-label={`Cash out ${win} dollars`}
                  >
                    CASH OUT (${win.toFixed(0)})
                  </button>
                </>
              ) : (
                <div className="in-game-status">
                  {isUserTurn ? "YOUR TURN" : "WATCH SEQUENCE..."}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MemoryPattern;
