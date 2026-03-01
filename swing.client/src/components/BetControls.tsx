import { useSound } from "../context/SoundContext";
import BalanceIcon from "./BalanceIcon";

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
  const { playClick } = useSound();
  const clampBet = (value: number) => {
    return Math.max(1, Math.min(Math.floor(value), balance, 10000));
  };

  const incBet = () => {
    playClick();
    setBetAmount(clampBet(betAmount + 10));
  };
  const decBet = () => {
    playClick();
    setBetAmount(clampBet(betAmount - 10));
  };
  const doubleBet = () => {
    playClick();
    setBetAmount(clampBet(betAmount * 2));
  };
  const halfBet = () => {
    playClick();
    setBetAmount(clampBet(betAmount / 2));
  };
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
                aria-label="Bet amount"
              />
            </div>
          </div>
        </div>
        <div className="bet-controls__buttons-group">
          <button
            className="bet-controls__button"
            onClick={decBet}
            aria-label="Decrease bet"
          >
            -
          </button>
          <div className="bet-controls__middle-buttons">
            <button
              className="bet-controls__button bet-controls__button--small"
              onClick={doubleBet}
              aria-label="Double bet"
            >
              2x
            </button>
            <button
              className="bet-controls__button bet-controls__button--small"
              onClick={halfBet}
              aria-label="Halve bet"
            >
              1/2
            </button>
          </div>
          <button
            className="bet-controls__button"
            onClick={incBet}
            aria-label="Increase bet"
          >
            +
          </button>
        </div>
      </div>
      {isPlaying ? (
        <button
          className={`bet-button bet-button--${betColor} bet-button--cashout`}
          onClick={() => {
            playClick();
            onCashOut();
          }}
          aria-label={cashOutLabel}
        >
          <span>{cashOutLabel}</span>
          {isCashingOut ? (
            <span className="bet-button__win">{winAmount.toFixed(2)}$</span>
          ) : null}
        </button>
      ) : (
        <button
          className="bet-button"
          onClick={() => {
            playClick();
            onStart();
          }}
          aria-label="Place bet"
        >
          BET
        </button>
      )}
      <p className="balance-info">
        <BalanceIcon /> ${balance.toFixed(2)}
      </p>
    </div>
  );
};

export default BetControls;
