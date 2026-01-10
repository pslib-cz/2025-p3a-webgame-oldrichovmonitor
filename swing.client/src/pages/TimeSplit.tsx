import { useState, useRef, useEffect } from "react";
import Footer from "../components/Footer";
import GridLines from "../components/GridLines";
import BetControls from "../components/BetControls";
import { Link } from "react-router-dom";
import "../css/games/timesplit.css";

const TimeSplit = () => {
  const [balance, setBalance] = useState(3000);
  const [targetTime, setTargetTime] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [win, setWin] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(0);
  // Track game result state: 'idle' | 'playing' | 'won' | 'lost'
  const [gameState, setGameState] = useState<
    "idle" | "playing" | "won" | "lost"
  >("idle");

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying && targetTime) setCurrentTime(0);
  }, [targetTime]);

  const startGame = () => {
    if (isPlaying) return;
    if (betAmount > balance) {
      alert("Insufficient balance!");
      return;
    }

    const min = 6000;
    const max = 14000;
    const randomTime = Math.floor(Math.random() * (max - min + 1) + min);
    const newTarget = Math.floor(randomTime / 10) * 10;
    setTargetTime(newTarget);

    setBalance((prev) => prev - betAmount);
    setWin(0);
    setIsPlaying(true);
    setGameState("playing"); // Set playing state
    setCurrentTime(0);

    intervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (newTarget && prev >= newTarget + 5000) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsPlaying(false);
          setGameState("lost"); // Auto lose if timeout
          return newTarget + 5000;
        }
        return prev + 10;
      });
    }, 10);
  };

  const stopGame = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);

    if (!targetTime) return;

    const timeDifference = Math.abs(targetTime - currentTime);

    try {
      const response = await fetch(
        `/api/TimeSwing/Result?targetTime=${targetTime}&actualTime=${currentTime}&diff=${timeDifference}&bet=${betAmount}`
      );

      if (response.ok) {
        const winAmount = await response.json();
        setWin(winAmount);

        if (winAmount > 0) {
          setBalance((prev) => prev + winAmount);
          setGameState("won");
        } else {
          setGameState("lost");
        }
      } else {
        console.error("Failed to fetch game result");
        setWin(0);
        setGameState("lost");
      }
    } catch (e) {
      console.error("Error connecting to game server", e);
      setWin(0);
      setGameState("lost");
    }
  };

  return (
    <div className="time-split-page page">
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
            <Link to="/" className="subtitle hoverable balance--order-switch">
              Exit to Arcade
            </Link>
          </div>
        </div>
      </header>
      <main>
        <div className="header__title-wrapper page__section game-page__header-title-wrapper">
          <h1 className="game-title">Time Split</h1>
          <p className="subtitle">Press to stop time with precision.</p>
        </div>
        <div className="time-split-game__wrapper">
          <div className="timesplit__target-time">
            <div className="timesplit__target-time__content">
              {/* SVG omitted for brevity, same as previous */}
              <p className="subtitle ibmplexmono white">TARGET:</p>
            </div>
            <p className="subtitle ibmplexmono purple">
              {targetTime ? (targetTime / 1000).toFixed(2) : "--.--"}s
            </p>
          </div>

          {/* Apply dynamic class based on gameState */}
          <div
            className={`timesplit__content timesplit__content--${gameState}`}
          >
            <p className="subtitle ibmplexmono white timesplit__time">
              {(currentTime / 1000).toFixed(2)}
              <span className="timesplit__unit">s</span>
            </p>
          </div>

          <BetControls
            balance={balance}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            isPlaying={isPlaying}
            onStart={startGame}
            onCashOut={stopGame}
            cashOutLabel="STOP"
            winAmount={win}
            isCashingOut={false}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TimeSplit;
