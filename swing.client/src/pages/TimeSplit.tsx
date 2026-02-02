import { useState, useRef, useEffect } from "react";
import Footer from "../components/Footer";
import GridLines from "../components/GridLines";
import BetControls from "../components/BetControls";
import { Link } from "react-router-dom";
import "../css/games/timesplit.css";
import { useBalance } from "../context/BalanceContext";

const TimeSplit = () => {
  const { balance, setBalance, setLevel } = useBalance();
  const [targetTime, setTargetTime] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [win, setWin] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [gameState, setGameState] = useState<
    "idle" | "playing" | "won" | "lost"
  >("idle");
  const [activeTier, setActiveTier] = useState<number | null>(null);

  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const intervalRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (!isPlaying && targetTime) setCurrentTime(0);
  }, [targetTime]);

  const startGame = async () => {
    if (isPlaying) return;
    if (betAmount > balance) {
      alert("Insufficient balance!");
      return;
    }

    try {
      const res = await fetch(
        `/api/Game/Bet?amount=${betAmount}&gameId=timesplit`,
        {
          method: "POST",
        },
      );

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setBalance(data.newBalance);

          const min = 3000;
          const max = 9500;
          const randomTime = Math.floor(Math.random() * (max - min + 1) + min);
          const newTarget = Math.floor(randomTime / 10) * 10;
          setTargetTime(newTarget);

          setActiveTier(null);
          setResultMessage(null);
          setWin(0);
          setIsPlaying(true);
          setGameState("playing");
          setCurrentTime(0);

          intervalRef.current = setInterval(() => {
            setCurrentTime((prev) => {
              if (newTarget && prev >= newTarget + 5000) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setIsPlaying(false);
                setGameState("lost");
                setResultMessage("Too Late");
                return newTarget + 5000;
              }
              return prev + 10;
            });
          }, 10);
        }
      }
    } catch (e) {
      console.error("Bet error", e);
    }
  };

  const stopGame = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);

    if (!targetTime) return;

    const timeDiff = currentTime - targetTime;
    const absDiff = Math.abs(timeDiff);

    let multiplier = 0;
    let tier = null;

    if (absDiff <= 200) {
      multiplier = 10;
      tier = 200;
    } else if (absDiff <= 500) {
      multiplier = 3;
      tier = 500;
    } else if (absDiff <= 1000) {
      multiplier = 1.1;
      tier = 1000;
    }

    setActiveTier(tier);

    const winAmount = betAmount * multiplier;
    setWin(winAmount);

    if (winAmount > 0) {
      setGameState("won");
      setResultMessage(`+${winAmount.toFixed(2)}$`);
      fetch(`/api/Game/Win?amount=${winAmount}`, { method: "POST" }).then(() =>
        fetchStatus(),
      );
    } else {
      setGameState("lost");
      if (timeDiff < 0) {
        setResultMessage("Too Early");
      } else {
        setResultMessage("Too Late");
      }
    }

    try {
      await fetch(
        `/api/TimeSwing/Result?targetTime=${targetTime}&actualTime=${currentTime}&diff=${absDiff}&bet=${betAmount}&win=${winAmount}`,
      );
    } catch (e) {
      console.warn("API sync failed", e);
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
                  d="M2 5H22V20H2V5ZM20 18V7H4V18H20ZM17 8C17 8.53043 17.2107 9.03914 17.5858 9.41421C17.9609 9.78929 18.4696 10 19 10V15C18.4696 15 17.9609 15.2107 17.5858 15.5858C17.2107 15.9609 17 16.4696 17 17H7C7 16.4696 6.78929 15.9609 6.41421 15.5858C6.03914 15.2107 5.53043 15 5 15V10C5.53043 10 6.03914 9.78929 6.41421 9.41421C6.78929 9.03914 7 8.53043 7 8H17ZM17 13V12C17 10.9 16.33 10 15.5 10C14.67 10 14 10.9 14 12V13C14 14.1 14.67 15 15.5 15C16.33 15 17 14.1 17 13ZM15.5 11C15.6326 11 15.7598 11.0527 15.8536 11.1464C15.9473 11.2402 16 11.3674 16 11.5V13.5C16 13.6326 15.9473 13.7598 15.8536 13.8536C15.7598 13.9473 15.6326 14 15.5 14C15.3674 14 15.2402 13.9473 15.1464 13.8536C15.0527 13.7598 15 13.6326 15 13.5V11.5C15 11.3674 15.0527 11.2402 11.1464 11.1464C11.2402 11.0527 11.3674 11 11.5 11ZM13 13V12C13 10.9 12.33 10 11.5 10C10.67 10 10 10.9 10 12V13C10 14.1 10.67 15 11.5 15C12.33 15 13 14.1 13 13ZM11.5 11C11.6326 11 11.7598 11.0527 11.8536 11.1464C11.9473 11.2402 12 11.3674 12 11.5V13.5C12 13.6326 11.9473 13.7598 11.8536 13.8536C11.7598 13.9473 11.6326 14 11.5 14C11.3674 14 11.2402 13.9473 11.1464 13.8536C11.0527 13.7598 11 13.6326 11 13.5V11.5C11 11.3674 11.0527 11.2402 11.1464 11.1464C11.2402 11.0527 11.3674 11 11.5 11ZM8 15H9V10H8L7 10.5V11.5L8 11V15Z"
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
          <h1 className="game-title">Time Split</h1>
          <p className="subtitle">Press to stop time with precision.</p>
        </div>
        <div className="time-split-game__wrapper game__wrapper">
          <div className="timesplit__target-time">
            <div className="timesplit__target-time__content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88334 20.6867 5.825 19.9743 4.925 19.075C4.025 18.1757 3.31267 17.1173 2.788 15.9C2.26333 14.6827 2.00067 13.3827 2 12C1.99933 10.6173 2.262 9.31733 2.788 8.1C3.314 6.88267 4.02633 5.82433 4.925 4.925C5.82367 4.02567 6.882 3.31333 8.1 2.788C9.318 2.26267 10.618 2 12 2C13.382 2 14.682 2.26267 15.9 2.788C17.118 3.31333 18.1763 4.02567 19.075 4.925C19.9737 5.82433 20.6863 6.88267 21.213 8.1C21.7397 9.31733 22.002 10.6173 22 12C21.998 13.3827 21.7353 14.6827 21.212 15.9C20.6887 17.1173 19.9763 18.1757 19.075 19.075C18.1737 19.9743 17.1153 20.687 15.9 21.213C14.6847 21.739 13.3847 22.0013 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20ZM12 18C10.3333 18 8.91667 17.4167 7.75 16.25C6.58333 15.0833 6 13.6667 6 12C6 10.3333 6.58333 8.91667 7.75 7.75C8.91667 6.58333 10.3333 6 12 6C13.6667 6 15.0833 6.58333 16.25 7.75C17.4167 8.91667 18 10.3333 18 12C18 13.6667 17.4167 15.0833 16.25 16.25C15.0833 17.4167 13.6667 18 12 18ZM12 16C13.1 16 14.0417 15.6083 14.825 14.825C15.6083 14.0417 16 13.1 16 12C16 10.9 15.6083 9.95833 14.825 9.175C14.0417 8.39167 13.1 8 12 8C10.9 8 9.95833 8.39167 9.175 9.175C8.39167 9.95833 8 10.9 8 12C8 13.1 8.39167 14.0417 9.175 14.825C9.95833 15.6083 10.9 16 12 16ZM12 14C11.45 14 10.9793 13.8043 10.588 13.413C10.1967 13.0217 10.0007 12.5507 10 12C9.99933 11.4493 10.1953 10.9787 10.588 10.588C10.9807 10.1973 11.4513 10.0013 12 10C12.5487 9.99867 13.0197 10.1947 13.413 10.588C13.8063 10.9813 14.002 11.452 14 12C13.998 12.548 13.8023 13.019 13.413 13.413C13.0237 13.807 12.5527 14.0027 12 14Z"
                  fill="#8B5CF6"
                />
              </svg>
              <p className="subtitle ibmplexmono white">TARGET:</p>
            </div>
            <p className="subtitle ibmplexmono purple">
              {targetTime ? (targetTime / 1000).toFixed(2) : "--.--"}s
            </p>
          </div>

          <div
            className={`timesplit__content timesplit__content--${gameState}`}
          >
            <div className="timesplit__timer-group">
              <p className="subtitle ibmplexmono white timesplit__time">
                {isPlaying && currentTime > 3000 ? (
                  <>
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>??.??</span>
                    <span className="timesplit__unit">s</span>
                  </>
                ) : (
                  <>
                    {(currentTime / 1000).toFixed(2)}
                    <span className="timesplit__unit">s</span>
                  </>
                )}
              </p>
              {resultMessage && !isPlaying && (
                <p
                  className={`subtitle ibmplexmono timesplit__result-text ${
                    gameState === "won" ? "gold" : "red"
                  }`}
                >
                  {resultMessage}
                </p>
              )}
            </div>
          </div>

          <div className="timesplit__multiplier-container">
            <article
              className={`timesplit__multiplier ${
                activeTier === 200 ? "timesplit__multiplier--active" : ""
              }`}
            >
              <p className="subtitle inter white">±0.20s</p>
              <p className="gold ibmplexmono subtitle">10X</p>
            </article>
            <article
              className={`timesplit__multiplier ${
                activeTier === 500 ? "timesplit__multiplier--active" : ""
              }`}
            >
              <p className="subtitle inter white">±0.50s</p>
              <p className="gold ibmplexmono subtitle">3X</p>
            </article>
            <article
              className={`timesplit__multiplier ${
                activeTier === 1000 ? "timesplit__multiplier--active" : ""
              }`}
            >
              <p className="subtitle inter white">±1.00s</p>
              <p className="gold ibmplexmono subtitle">1.1X</p>
            </article>
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
            betColor="red"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TimeSplit;
