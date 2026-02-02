import Footer from "../components/Footer";
import { useState, useEffect, useRef } from "react";
import "../css/games/slider.css";
import { useBalance } from "../context/BalanceContext";
import { Link } from "react-router-dom";
import GridLines from "../components/GridLines";
import BetControls from "../components/BetControls";

function PrecisionSlider() {
  const { balance, setBalance, setLevel } = useBalance();
  const [sliderPosition, setSliderPosition] = useState(500);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [betAmount, setBetAmount] = useState(100);
  const [multiplier, setMultiplier] = useState<number | null>(null);
  const [win, setWin] = useState<number>(0);
  const [sliderSpeed, setSliderSpeed] = useState(30);
  const [peakPosition, setPeakPosition] = useState(500);

  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    fetchStatus();
    fetch("/api/PrecisionSlider/Start")
      .then((res) => res.json())
      .then((data) => {
        if (data.startSpeed) setSliderSpeed(data.startSpeed);
      });
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

  const animate = () => {
    setSliderPosition((prevPos) => {
      let angle = 0;
      const safePeak = Math.max(1, Math.min(999, peakPosition));

      if (prevPos <= safePeak) {
        angle = (prevPos / safePeak) * (Math.PI / 2);
      } else {
        angle =
          Math.PI / 2 +
          ((prevPos - safePeak) / (1000 - safePeak)) * (Math.PI / 2);
      }

      const minSpeed = 2;
      const dynamicSpeed = minSpeed + sliderSpeed * Math.sin(angle);

      let nextPos = prevPos + direction * dynamicSpeed;
      if (nextPos >= 1000) {
        nextPos = 1000;
        setDirection(-1);
      } else if (nextPos <= 0) {
        nextPos = 0;
        setDirection(1);
      }
      return nextPos;
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, direction, sliderSpeed]);

  const handleStart = async () => {
    if (betAmount > balance) {
      alert("Insufficient balance!");
      return;
    }

    try {
      const res = await fetch(
        `/api/Game/Bet?amount=${betAmount}&gameId=slider`,
        {
          method: "POST",
        },
      );

      if (res.ok) {
        const data = await res.json();

        if (data.success) {
          setBalance(data.newBalance);
          setMultiplier(null);
          setWin(0);
          setSliderPosition(0);
          setDirection(1);
          setPeakPosition(Math.floor(Math.random() * 600) + 200);
          setIsPlaying(true);
        }
      } else {
        const errorMsg = await res.text();
        alert(errorMsg || "Bet failed");
      }
    } catch (error) {
      console.error("Bet request failed", error);
    }
  };

  const handleStop = async () => {
    setIsPlaying(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    const distance = Math.abs(500 - sliderPosition) / 10;

    try {
      const res = await fetch(
        `/api/PrecisionSlider/Multiplier?distance=${distance}`,
      );
      const mult = await res.json();

      const currentWin = Math.floor(betAmount * mult);

      setMultiplier(mult);
      setWin(currentWin);

      if (currentWin > 0) {
        await fetch(`/api/Game/Win?amount=${currentWin}`, { method: "POST" });
      }
      await fetchStatus();
    } catch (error) {
      console.log("Setting win failed");
    }
  };

  return (
    <div className="slider-page page">
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
          <h1 className="game-title">Precision Slider</h1>
          <p className="subtitle">Stop the slider in the target zone</p>
        </div>

        <div className="slider-game-card">
          <div className="multiplier-display">
            {multiplier !== null ? (
              <span
                className="multiplier-value"
                style={{
                  color:
                    multiplier > 1
                      ? "var(--slider-success)"
                      : "var(--slider-danger)",
                }}
              >
                {multiplier}x
              </span>
            ) : (
              <span className="waiting">Ready...</span>
            )}
            {win > 0 && <div className="win-text">+{win} coins</div>}
          </div>

          <div className="slider-container">
            <div className="slider-target-zone"></div>
            <div
              className={`slider-cursor ${!isPlaying && multiplier !== null ? "stopped" : ""}`}
              style={{ left: `${sliderPosition / 10}%` }}
            ></div>
          </div>

          <div className="slider-controls">
            <BetControls
              balance={balance}
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              onStart={handleStart}
              isPlaying={isPlaying}
              isCashingOut={isPlaying}
              onCashOut={handleStop}
              cashOutLabel="STOP!"
              winAmount={0}
              betColor="red"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PrecisionSlider;
