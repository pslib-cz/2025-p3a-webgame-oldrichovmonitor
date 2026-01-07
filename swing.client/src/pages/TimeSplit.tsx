import { useState, useRef, useEffect } from "react";
import Footer from "../components/Footer";
import GridLines from "../components/GridLines";

const TimeSplit = () => {
  const [targetTime, setTargetTime] = useState(7000);
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [win, setWin] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(targetTime);
  const intervalRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isPlaying) setCurrentTime(targetTime);
  }, [targetTime]);

  const startGame = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setCurrentTime(targetTime);
    intervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev <= -5000) {
          clearInterval(intervalRef.current!);
          setIsPlaying(false);
          return -5000;
        }
        return prev - 10;
      });
    }, 10);
  };

  const stopGame = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
    const response = await fetch(
      `/api/TimeSwing/Result?targetTime=${targetTime}&stoppedTime=${currentTime}&bet=${betAmount}`
    );
    const win = await response.json();
    setWin(win);
  };

  const cashOut = () => {};

  return (
    <>
      <label>
        Cílový čas:&nbsp;
        <select
          value={targetTime}
          onChange={(e) => setTargetTime(Number(e.target.value))}
          disabled={isPlaying}
        >
          <option value={3000}>3 sekundy</option>
          <option value={5000}>5 sekund</option>
          <option value={7000}>7 sekund</option>
          <option value={10000}>10 sekund</option>
        </select>
      </label>
      <p>{(currentTime / 1000).toFixed(2)} s</p>
      <button onClick={stopGame} disabled={!isPlaying}>
        STOP
      </button>
      <button onClick={startGame} disabled={isPlaying}>
        bet
      </button>
      <button>Bet Amount: {betAmount}</button>
      <button onClick={() => setBetAmount(betAmount - 10)}>-</button>
      <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
      <p>You win: {win}</p>
      <button onClick={cashOut}>Cash Out</button>
    </>
  );
};

export default TimeSplit;
