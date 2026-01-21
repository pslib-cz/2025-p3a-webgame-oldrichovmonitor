import Footer from "../components/Footer";
import { useState, useEffect, useRef } from "react";
import { useBalance } from "../context/BalanceContext";

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
      const res = await fetch(`/api/Game/Bet?amount=${betAmount}`, {
        method: "POST",
      });

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
    <div className="page-container">
      <div className="content-container">
        <h1>Precision Slider</h1>
        <p>Stop the slider at the center (50%) to win max multiplier!</p>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "50px",
            backgroundColor: "#333",
            margin: "50px 0",
            borderRadius: "25px",
            overflow: "hidden",
          }}
        >
          {/* Center Line */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "0",
              bottom: "0",
              width: "4px",
              backgroundColor: "red",
              transform: "translateX(-50%)",
              zIndex: 1,
            }}
          ></div>

          {/* Slider Ball */}
          <div
            style={{
              position: "absolute",
              left: `${sliderPosition / 10}%`,
              top: "50%",
              width: "30px",
              height: "30px",
              backgroundColor: "#00ff00",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
              transition: isPlaying ? "none" : "left 0.1s ease-out",
            }}
          ></div>
        </div>

        <div className="controls">
          <div className="bet-controls">
            <button
              onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
              disabled={isPlaying}
            >
              -
            </button>
            <span style={{ margin: "0 20px", fontSize: "1.2em" }}>
              Bet: {betAmount}
            </span>
            <button
              onClick={() => setBetAmount(betAmount + 10)}
              disabled={isPlaying}
            >
              +
            </button>
          </div>

          <div>
            {!isPlaying ? (
              <button className="btn-primary" onClick={handleStart}>
                BET
              </button>
            ) : (
              <button className="btn-danger" onClick={handleStop}>
                STOP
              </button>
            )}
          </div>
          <p>Multiplier: {multiplier}</p>
          <p>Win: {win - betAmount}</p>
          <p>Balance: {balance}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PrecisionSlider;
