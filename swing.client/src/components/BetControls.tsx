import React from "react";

interface BetControlsProps {
  balance: number;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  isPlaying: boolean;
  isCashingOut: boolean;
  onStart: () => void;
  onCashOut: () => void;
  cashOutLabel?: string;
  winAmount?: number;
  betColor?: "green" | "red";
}

const BetControls: React.FC<BetControlsProps> = ({
  balance,
  betAmount,
  setBetAmount,
  isPlaying,
  isCashingOut,
  onStart,
  onCashOut,
  cashOutLabel = "CASH OUT",
  betColor = "green",
  winAmount = 0,
}) => {
  const clampBet = (value: number) => {
    return Math.max(1, Math.min(Math.floor(value), balance));
  };
  const greenStyle = {
    background: "linear-gradient(to right, #10b981, #059669)",
    borderBottomColor: "#064e3b",
    boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
  };

  const redStyle = {
    background: "linear-gradient(to right, #EF4444, #B91C1C)",
    borderBottomColor: "#7F1D1D",
    boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)",
  };

  const activeStyle = betColor === "red" ? redStyle : greenStyle;

  const incBet = () => setBetAmount(clampBet(betAmount + 10));
  const decBet = () => setBetAmount(clampBet(betAmount - 10));
  const doubleBet = () => setBetAmount(clampBet(betAmount * 2));
  const halfBet = () => setBetAmount(clampBet(betAmount / 2));
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(clampBet(Number(e.target.value)));
  };

  return (
    <div className="mines__game-nav">
      <div className="mines-button__bet-controls">
        <div className="bet-controls__left-section">
          <div className="bet-controls__text-input-group">
            <p className="subtitle bet-controls__text">BET AMOUNT</p>
            <div>
              <input
                type="number"
                className="bet-controls__input"
                value={betAmount}
                onChange={handleInputChange}
                min={1}
              />
              {/* <svg
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
              </svg> */}
            </div>
          </div>
        </div>
        <div className="bet-controls__buttons-group">
          <button className="bet-controls__button" onClick={decBet}>
            -
          </button>
          <div className="bet-controls__middle-buttons">
            <button
              className="bet-controls__button bet-controls__button--small"
              onClick={doubleBet}
            >
              2x
            </button>
            <button
              className="bet-controls__button bet-controls__button--small"
              onClick={halfBet}
            >
              1/2
            </button>
          </div>
          <button className="bet-controls__button" onClick={incBet}>
            +
          </button>
        </div>
      </div>
      {isPlaying ? (
        <button
          className="bet-button"
          style={{
            ...activeStyle,
            flexDirection: "column",
            gap: "4px",
          }}
          onClick={onCashOut}
        >
          <span>{cashOutLabel}</span>
          {isCashingOut ? (
            <span style={{ fontSize: "0.9em", opacity: 0.9 }}>
              {winAmount.toFixed(2)}$
            </span>
          ) : null}
        </button>
      ) : (
        <button className="bet-button" onClick={onStart}>
          BET
        </button>
      )}
      <p className="balance-info">
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
        </svg>{" "}
        ${balance.toFixed(2)}
      </p>
    </div>
  );
};

export default BetControls;
