import Footer from "../components/Footer";
import { useState, useEffect, useRef } from "react";
import "../css/games/slider.css";
import { useBalance } from "../context/BalanceContext";
import { useSound } from "../context/SoundContext";
import GridLines from "../components/GridLines";
import GameHeader from "../components/GameHeader";
import BetControls from "../components/BetControls";

function PrecisionSlider() {
  const { balance, unlockedGames, fetchUser, updateUser } = useBalance();
  const { playWin, playLose } = useSound();
  const [sliderPosition, setSliderPosition] = useState(500);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [betAmount, setBetAmount] = useState(100);
  const [multiplier, setMultiplier] = useState<number | null>(null);
  const [win, setWin] = useState<number>(0);
  const [toast, setToast] = useState<string | null>(null);
  const [sliderSpeed, setSliderSpeed] = useState(30);
  const [peakPosition, setPeakPosition] = useState(500);
  const [sliderConfig, setSliderConfig] = useState({
    zoneWidthPx: 50,
    speedMultiplier: 1.0,
  });

  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    fetchUser();
    // Fetch slider config from backend
    fetch("/api/games/slider")
      .then((res) => res.json())
      .then((data) => {
        setSliderConfig({
          zoneWidthPx: data.zoneWidthPx,
          speedMultiplier: data.speedMultiplier,
        });
        setSliderSpeed(30 * data.speedMultiplier);
      })
      .catch((err) => console.error("Failed to fetch slider config", err));
  }, []);

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
      setToast("Insufficient balance!");
      playLose();
      return;
    }

    // Deduct bet locally and save to backend
    const newBalance = balance - betAmount;
    await updateUser(newBalance, unlockedGames);

    setToast(null);

    setMultiplier(null);
    setWin(0);
    setSliderPosition(0);
    setDirection(1);
    setPeakPosition(Math.floor(Math.random() * 600) + 200);
    setIsPlaying(true);
  };

  const handleStop = async () => {
    setIsPlaying(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    const distance = Math.abs(500 - sliderPosition) / 10;

    // Calculate multiplier locally based on distance from center and zone width
    const zoneWidth = sliderConfig.zoneWidthPx;
    let mult = 0;
    if (distance <= zoneWidth * 0.2) {
      mult = 5;
    } else if (distance <= zoneWidth * 0.5) {
      mult = 2;
    } else if (distance <= zoneWidth) {
      mult = 1.2;
    } else {
      mult = 0;
    }

    const currentWin = Math.floor(betAmount * mult);

    setMultiplier(mult);
    setWin(currentWin);

    if (currentWin > 0) {
      playWin();
      const newBalance = balance + currentWin;
      await updateUser(Math.round(newBalance), unlockedGames);
    } else {
      playLose();
    }
  };

  return (
    <div className="slider-page page">
      <GridLines />
      <GameHeader
        title="Precision Slider"
        subtitle="Stop the slider in the target zone"
      />

      <main>
        <div className="slider-game-card">
          <div className="multiplier-display">
            {multiplier !== null ? (
              <span
                className={`multiplier-value ${multiplier > 1 ? "multiplier-value--win" : "multiplier-value--lose"}`}
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
            {toast && (
              <div className="game-toast game-toast--error" role="alert">
                {toast}
              </div>
            )}
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
