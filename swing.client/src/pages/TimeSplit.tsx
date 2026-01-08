import { useState, useRef, useEffect } from "react";
import Footer from "../components/Footer";
import GridLines from "../components/GridLines";
import BetControls from "../components/BetControls";
import { Link } from "react-router-dom";

const TimeSplit = () => {
  const [balance, setBalance] = useState(3000);
  const [targetTime, setTargetTime] = useState(7000);
  const [betAmount, setBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [win, setWin] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) setCurrentTime(0);
  }, [targetTime]);

  const startGame = () => {
    if (isPlaying) return;
    if (betAmount > balance) {
      alert("Insufficient balance!");
      return;
    }
    setBalance((prev) => prev - betAmount);
    setWin(0);
    setIsPlaying(true);
    setCurrentTime(0);
    intervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= targetTime + 5000) {
          clearInterval(intervalRef.current!);
          setIsPlaying(false);
          return targetTime + 5000;
        }
        return prev + 10;
      });
    }, 10);
  };

  const stopGame = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
    const stoppedTime = targetTime - currentTime;

    // Simulate win for now
    try {
      const response = await fetch(
        `/api/TimeSwing/Result?targetTime=${targetTime}&stoppedTime=${stoppedTime}&bet=${betAmount}`
      );
      if (response.ok) {
        const winAmount = await response.json();
        setWin(winAmount);
        setBalance((prev) => prev + winAmount);
      } else {
        setWin(0);
      }
    } catch (e) {
      setWin(0);
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
          <label className="timesplit-button timesplit-button__multiplier">
            <div className="timesplit-button__icon-wrapper">
              <p className="timesplit-button__text">PREVIOUS WIN:</p>
            </div>
            <p className="timesplit-button__subtext">
              {win > 0 ? win.toFixed(2) + "$" : "-"}
            </p>
          </label>

          <div className="timesplit__content">
            <p
              className="subtitle ibmplexmono white"
              style={{
                fontSize: "3rem",
                textAlign: "center",
                margin: "2rem 0",
              }}
            >
              {(currentTime / 1000).toFixed(2)} s
            </p>
            <label
              style={{
                display: "block",
                textAlign: "center",
                marginBottom: "1rem",
                color: "white",
              }}
            >
              Target:
              <select
                value={targetTime}
                onChange={(e) => setTargetTime(Number(e.target.value))}
                disabled={isPlaying}
                style={{ marginLeft: "10px", padding: "5px" }}
              >
                <option value={3000}>3.00 s</option>
                <option value={5000}>5.00 s</option>
                <option value={7000}>7.00 s</option>
                <option value={10000}>10.00 s</option>
              </select>
            </label>
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
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TimeSplit;
