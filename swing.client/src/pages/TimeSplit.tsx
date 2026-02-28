import { useState, useRef, useEffect } from "react";
import Footer from "../components/Footer";
import GridLines from "../components/GridLines";
import GameHeader from "../components/GameHeader";
import BetControls from "../components/BetControls";
import "../css/games/timesplit.css";
import { useBalance } from "../context/BalanceContext";
import { useSound } from "../context/SoundContext";

const TimeSplit = () => {
  const { balance, unlockedGames, fetchUser, updateUser } = useBalance();
  const { playWin, playLose } = useSound();
  const [targetTime, setTargetTime] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [win, setWin] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [gameState, setGameState] = useState<
    "idle" | "playing" | "won" | "lost"
  >("idle");
  const [activeTier, setActiveTier] = useState<number | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [timeConfig, setTimeConfig] = useState({
    minTime: 3000,
    maxTime: 9500,
  });

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    fetchUser();
    // Fetch time config from backend
    fetch("/api/games/time")
      .then((res) => res.json())
      .then((data) => {
        setTimeConfig({ minTime: data.minTime, maxTime: data.maxTime });
      })
      .catch((err) => console.error("Failed to fetch time config", err));
  }, []);

  useEffect(() => {
    if (!isPlaying && targetTime) setCurrentTime(0);
  }, [targetTime]);

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

    const min = timeConfig.minTime;
    const max = timeConfig.maxTime;
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
          playLose();
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

    const timeDiff = currentTime - targetTime;
    const absDiff = Math.abs(timeDiff);

    let multiplier = 0;
    let tier = null;

    if (absDiff <= 40) {
      multiplier = 10;
      tier = 40;
    } else if (absDiff <= 100) {
      multiplier = 3;
      tier = 100;
    } else if (absDiff <= 300) {
      multiplier = 1.1;
      tier = 300;
    }

    setActiveTier(tier);

    const winAmount = betAmount * multiplier;
    setWin(winAmount);

    if (winAmount > 0) {
      setGameState("won");
      setResultMessage(`+${winAmount.toFixed(2)}$`);
      playWin();
      const newBalance = balance + winAmount;
      await updateUser(Math.round(newBalance), unlockedGames);
    } else {
      setGameState("lost");
      playLose();
      if (timeDiff < 0) {
        setResultMessage("Too Early");
      } else {
        setResultMessage("Too Late");
      }
    }
  };

  return (
    <div className="time-split-page page">
      <GridLines />
      <GameHeader
        title="Time Split"
        subtitle="Press to stop time with precision."
      />
      <main>
        <div className="time-split-game__wrapper game__wrapper">
          <div className="timesplit__game-area">
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
                      <span className="timesplit__time--hidden">
                        ??.??
                      </span>
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
                  activeTier === 40 ? "timesplit__multiplier--active" : ""
                }`}
              >
                <p className="subtitle inter white">±0.04s</p>
                <p className="gold ibmplexmono subtitle">10X</p>
              </article>
              <article
                className={`timesplit__multiplier ${
                  activeTier === 100 ? "timesplit__multiplier--active" : ""
                }`}
              >
                <p className="subtitle inter white">±0.10s</p>
                <p className="gold ibmplexmono subtitle">3X</p>
              </article>
              <article
                className={`timesplit__multiplier ${
                  activeTier === 300 ? "timesplit__multiplier--active" : ""
                }`}
              >
                <p className="subtitle inter white">±0.30s</p>
                <p className="gold ibmplexmono subtitle">1.1X</p>
              </article>
            </div>
          </div>

          <div className="timesplit__controls">
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
              onCashOut={stopGame}
              cashOutLabel="STOP"
              winAmount={win}
              isCashingOut={false}
              betColor="red"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TimeSplit;
