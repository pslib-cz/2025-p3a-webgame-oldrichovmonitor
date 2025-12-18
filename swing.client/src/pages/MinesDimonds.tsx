import { useState } from "react";

interface Tile {
  id: number;
  status: "mine" | "diamond";
  hidden: boolean;
}

const MinesDimonds = () => {
  const [minesCount, setMinesCount] = useState(2);
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openedTiles, setOpenedTiles] = useState(0);
  const [win, setWin] = useState<number>(0);
  const [grid, setGrid] = useState<Tile[]>(
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      status: "diamond",
      hidden: true,
    }))
  );

  const startGame = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setOpenedTiles(0);
    setWin(0);
    setGrid(
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        status: "diamond",
        hidden: true,
      }))
    );

    await fetch(`/api/MinePattern/StartGame/${minesCount}`);
  };
  const getMultiplier = async (openedTiles: number) => {
    const response = await fetch(
      `/api/MinePattern/Multiplier?openedTiles=${openedTiles}&mines=${minesCount}`
    );
    const multiplier = await response.json();
    return multiplier;
  };

  const cashOut = () => {};

  const handleTileClick = async (index: number) => {
    if (!isPlaying || !grid[index].hidden) return;
    const response = await fetch(`/api/MinePattern/Reveal?index=${index}`);
    const data = await response.json();

    const newGrid = [...grid];
    newGrid[index].hidden = false;
    newGrid[index].status = data.isMine ? "mine" : "diamond";
    setGrid(newGrid);

    if (data.isMine) {
      setIsPlaying(false);
      setWin(0);
    } else {
      const newOpened = openedTiles + 1;
      setOpenedTiles(newOpened);
      const multiplier = await getMultiplier(newOpened);
      setWin(betAmount * multiplier);
      alert(`Diamant! Multiplier: ${multiplier}`);
    }
  };
  return (
    <div className="mines-dimonds-page page">
      <span className="grid-lines"></span>
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
            <div className="header__balance">
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
              <p className="subtitle ibmplexmono white">Balance: 3 000$</p>
            </div>
            <p className="subtitle hoverable">Exit to Arcade</p>
          </div>
        </div>
      </header>
      <main>
        <div className="header__title-wrapper page__section game-page__header-title-wrapper">
          <h1 className="game-title">Mines & Diamonds</h1>
          <p className="subtitle">Avoid mines and uncover shining diamonds.</p>
        </div>
        <div className="mines-game__wrapper">
          <div className="mines-buttons">
            <a className="mines-button mines-button__mines-count">
              <div className="mines-button__icon-wrapper">
                <p className="mines-button__text">MINES:</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="12"
                  viewBox="0 0 24 12"
                  fill="none"
                >
                  <g clip-path="url(#clip0_72_199)">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.2889 10.1571L5.63186 4.50006L7.04586 3.08606L11.9959 8.03606L16.9459 3.08606L18.3599 4.50006L12.7029 10.1571C12.5153 10.3445 12.261 10.4498 11.9959 10.4498C11.7307 10.4498 11.4764 10.3445 11.2889 10.1571Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_72_199">
                      <rect
                        width="12"
                        height="24"
                        fill="white"
                        transform="matrix(0 1 -1 0 24 0)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <p className="mines-button__subtext">{minesCount}</p>
            </a>
            <a className="mines-button mines-button__multiplier">
              <div className="mines-button__icon-wrapper">
                <p className="mines-button__text">NEXT MULTIPLIER:</p>
              </div>
              <p className="mines-button__subtext">1,7x</p>
            </a>
          </div>
          <div className="grid-container">
            {grid.map((tile, index) => (
              <div key={tile.id} onClick={() => handleTileClick(index)}></div>
            ))}
          </div>
          
          <div className="mines__game-nav">
            
            <button onClick={() => startGame()}>bet</button>
            <button>Bet Amount: {betAmount}</button>
            <button onClick={() => setBetAmount(betAmount - 10)}>-</button>
            <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
            <button>Pocet sebranych diamantu: {openedTiles}</button>
            <p>You win: {win}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MinesDimonds;
