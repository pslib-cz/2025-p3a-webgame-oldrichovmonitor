import { Link } from "react-router-dom";

interface GameProps {
  id: string;
  name: string;
  description: string;
  route: string;
  isLocked: boolean;
  hasUsedFreeUnlock: boolean;
  balance: number;
  unlockCost: number;
  onUnlock: (id: string) => void;
}

const getGameIcon = (route: string) => {
  switch (route) {
    case "/timesplit":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 7.61305 18.0518 5.32387 16.364 3.63604C14.6761 1.94821 12.3869 1 10 1C7.61305 1 5.32387 1.94821 3.63604 3.63604C1.94821 5.32387 1 7.61305 1 10Z"
            stroke="#24D3EF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 5V10L13 13"
            stroke="#24D3EF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "/memmorypattern":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M10 4V8H14V4H10ZM16 4V8H20V4H16ZM16 10V14H20V10H16ZM16 16V20H20V16H16ZM14 20V16H10V20H14ZM8 20V16H4V20H8ZM8 14V10H4V14H8ZM8 8V4H4V8H8ZM10 14H14V10H10V14ZM4 2H20C20.5304 2 21.0391 2.21071 21.4142 2.58579C21.7893 2.96086 22 3.46957 22 4V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H4C2.92 22 2 21.1 2 20V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2Z"
            fill="#34D399"
          />
        </svg>
      );
    case "/precisionslider":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
            stroke="#E979F9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "/mines":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M6 5H18L21 10L12.5 19.5C12.4348 19.5665 12.357 19.6194 12.2712 19.6554C12.1853 19.6915 12.0931 19.7101 12 19.7101C11.9069 19.7101 11.8147 19.6915 11.7288 19.6554C11.643 19.6194 11.5652 19.5665 11.5 19.5L3 10L6 5Z"
            stroke="#F46464"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 12L8 9.80005L8.6 8.80005"
            stroke="#F46464"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
};

const Game: React.FC<GameProps> = ({
  id,
  name,
  description,
  route,
  isLocked,
  hasUsedFreeUnlock,
  balance,
  unlockCost,
  onUnlock,
}) => {
  if (!isLocked) {
    return (
      <Link to={route} className="game-link">
        <article className="game">
          <div className="game__icon">{getGameIcon(route)}</div>
          <div className="game__text">
            <h3>{name}</h3>
            <p className="subtext limit-width">{description}</p>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <article className="game game--locked">
      <div className="game__icon">{getGameIcon(route)}</div>
      <div className="game__text">
        <h3>{name}</h3>
        <p className="subtext limit-width">{description}</p>
      </div>
      {!hasUsedFreeUnlock ? (
        <button
          onClick={() => onUnlock(id)}
          className="btn btn--unlock btn--unlock--free"
        >
          <span className="btn__icon">🎁</span> UNLOCK FREE
        </button>
      ) : balance >= unlockCost ? (
        <button onClick={() => onUnlock(id)} className="btn btn--unlock">
          <span className="btn__icon">💰</span> UNLOCK ({unlockCost}$)
        </button>
      ) : (
        <div className="lock-message">
          🔒 Need {unlockCost - balance}${" "}
          <span className="unlock-text-suffix">&nbsp;to unlock</span>
        </div>
      )}
    </article>
  );
};

export default Game;
