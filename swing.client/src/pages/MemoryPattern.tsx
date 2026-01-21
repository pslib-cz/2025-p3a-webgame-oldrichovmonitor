import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import GridLines from "../components/GridLines";
import { Link } from "react-router-dom";
import BetControls from "../components/BetControls";
import "../css/games/memory.css";
import { useBalance } from "../context/BalanceContext";

interface Tile {
  id: number;
  status: "active" | "inactive";
  hidden: boolean;
}

const MULTIPLIERS = [1.01, 1.1, 1.2, 1.5, 2.1, 3.2, 5.0, 8.5, 15, 32];

const MemoryPattern = () => {
  const { balance, setBalance, setLevel } = useBalance();
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
    })),
  );

  useEffect(() => {
    fetchStatus();
    if (!isPlaying) {
      setRoundOver(false);
      setWin(0);
    }
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
    if (isPlaying && !roundOver) return;

    if (betAmount > balance) {
      alert("Insufficient balance!");
      return;
    }

    try {
      const res = await fetch(
        `/api/Game/Bet?amount=${betAmount}&gameId=memorypattern`,
        {
          method: "POST",
        },
      );

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setBalance(data.newBalance);

          setIsPlaying(true);
          setRoundOver(false);
          setWin(0);
          setPatternLength(3);
          setUserSequence([]);

          fetchAndPlayPattern(3, true);
        }
      } else {
        const errorMsg = await res.text();
        alert(errorMsg || "Bet failed");
      }
    } catch (error) {
      console.error("Bet request failed", error);
    }
  };

  const continueGame = () => {
    setRoundOver(false);
    setUserSequence([]);
    const newLength = patternLength + 1;
    setPatternLength(newLength);
    fetchAndPlayPattern(newLength, false);
  };

  const fetchAndPlayPattern = async (length: number, newGame = false) => {
    setIsUserTurn(false);
    try {
      const response = await fetch(
        `/api/MemoryPattern/GeneratePattern?length=${length}&newGame=${newGame.toString()}&t=${Date.now()}`,
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log("Receive Pattern:", data);
      setPattern(data);
      playPattern(data);
    } catch (error) {
      console.error("Failed to fetch pattern", error);
      setIsPlaying(false);
      alert("Game Error");
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

    // Check if sequence is complete
    if (newUserSequence.length === pattern.length) {
      setIsUserTurn(false);
      setRoundOver(true);

      const multiplier = await getMultiplier(patternLength);
      setWin(Math.floor(betAmount * multiplier));
    }
  };

  const cashOut = async () => {
    setIsPlaying(false);
    setRoundOver(false);
    setIsUserTurn(false);

    setIsPlaying(false);
    setRoundOver(false);
    setIsUserTurn(false);
    setWin(0);
    setPatternLength(3);
    setUserSequence([]);

    try {
      if (win > 0) {
        await fetch(`/api/Game/Win?amount=${win}`, { method: "POST" });
      }
      await fetchStatus();
    } catch (error) {
      console.error("Cashout failed", error);
    }
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
          <div className="memory-multipliers">
            {MULTIPLIERS.map((mul, i) => {
              const isActive = i === patternLength - 3;
              const isPassed = i < patternLength - 3;
              return (
                <div
                  key={i}
                  className={`memory-multiplier ${isActive ? "active" : ""}`}
                  style={{
                    color: isActive ? "#EBB30B" : "white",
                    fontWeight: isActive ? "bold" : "normal",
                    opacity: isPassed || isActive ? 1 : 0.5,
                    transform: isActive ? "scale(1.2)" : "scale(1)",
                  }}
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
                className={index === highlighted ? "tile--highlighted" : ""}
                style={{ cursor: isUserTurn ? "pointer" : "default" }}
              ></div>
            ))}
          </div>

          {/* Conditional Controls */}
          {!isPlaying ? (
            <BetControls
              balance={balance}
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              isPlaying={isPlaying}
              onStart={startGame}
              onCashOut={cashOut}
              winAmount={win}
              isCashingOut={false}
              betColor="red"
            />
          ) : (
            <div
              className="in-game-controls"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "80px",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  color: "white",
                  marginBottom: "10px",
                  fontSize: "1.2em",
                }}
              >
                {roundOver ? (
                  <span style={{ color: "#4ade80" }}>ROUND WIN: ${win}</span>
                ) : isUserTurn ? (
                  <span style={{ color: "#EBB30B" }}>YOUR TURN</span>
                ) : (
                  "WATCH PATTERN..."
                )}
              </div>

              {roundOver && (
                <div style={{ display: "flex", gap: "15px" }}>
                  <button
                    onClick={continueGame}
                    style={{
                      padding: "10px 20px",
                      background: "#3b82f6",
                      border: "none",
                      borderRadius: "5px",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    CONTINUE
                  </button>
                  <button
                    onClick={cashOut}
                    style={{
                      padding: "10px 20px",
                      background: "#22c55e",
                      border: "none",
                      borderRadius: "5px",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    CASH OUT
                  </button>
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
