import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import GridLines from "../components/GridLines";
import Game from "../components/Game";
import { useBalance } from "../context/BalanceContext";
import { useSound } from "../context/SoundContext";
import ProgressBar from "../components/ProgressBar";

interface GameData {
  id: string;
  name: string;
  description: string;
  route: string;
  isLocked: boolean;
}

const HomePage = () => {
  const { balance, username, setUsername, setBalance, setLevel } = useBalance();
  const { playClick, playSuccess, playError } = useSound();
  const [games, setGames] = useState<GameData[]>([]);
  const [unlockCost, setUnlockCost] = useState(500);
  const [hasUsedFreeUnlock, setHasUsedFreeUnlock] = useState(false);

  const fetchData = () => {
    fetch("/api/Game/Status")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setBalance(data.balance);
          setLevel(data.level);
          setUsername(data.username);
          setGames(data.games);
          setUnlockCost(data.unlockCost);
          setHasUsedFreeUnlock(data.hasUsedFreeUnlock);
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUnlock = async (gameId: string) => {
    const res = await fetch(`/api/Game/Unlock?gameId=${gameId}`, {
      method: "POST",
    });
    if (res.ok) {
      playSuccess();
      fetchData();
    } else {
      playError();
    }
  };

  return (
    <div className="home-page page">
      <GridLines />

      <header className=" home-page__header">
        <div className="page__section header__content-wrapper">
          <div className="home-page__title-text">
            <h2 className="">
              Hello,<span className="text-gradient">{username}</span>
            </h2>
            <p className="subtitle">Ready to play?</p>
          </div>
          <div className="home-page__nav">
            <div className="home-page__balance">
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
              <p className="subtitle ibmplexmono white">Balance: {balance}$</p>
            </div>
            <Link
              to="/"
              className="subtitle hoverable balance--order-switch"
              style={{ textDecoration: "none" }}
              onClick={async () => {
                playClick();
                localStorage.removeItem("swing_user_id");
                await fetch("/api/Game/Reset", { method: "POST" });
              }}
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>
      <main className="home-page__main">
        <img
          className="logo hide-on-mobile"
          src="/images/logo.png"
          alt="Logo"
          width={186}
          height={135}
        />
        <div className="home-page__content-wrapper">
          <div className="home-page__balance balance--mobile">
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
            <p className="subtitle ibmplexmono white">Balance: {balance}$</p>
          </div>
          <div className="home-page__games">
            {games?.map((game) => (
              <Game
                key={game.id}
                id={game.id}
                name={game.name}
                description={game.description}
                route={game.route}
                isLocked={game.isLocked}
                hasUsedFreeUnlock={hasUsedFreeUnlock}
                balance={balance}
                unlockCost={unlockCost}
                onUnlock={handleUnlock}
              />
            ))}

            <article className="game comming-soon">
              <div className="game__icon comming-soon__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="9"
                  height="14"
                  viewBox="0 0 9 14"
                  fill="none"
                >
                  <path
                    d="M0.000318985 3.429C-0.00173444 3.47744 0.00614283 3.52579 0.0234661 3.57107C0.0407893 3.61636 0.0671923 3.65762 0.101052 3.69232C0.134912 3.72703 0.175512 3.75444 0.220357 3.77287C0.265201 3.7913 0.313342 3.80036 0.361818 3.7995H1.59932C1.80632 3.7995 1.97132 3.63 1.99832 3.4245C2.13332 2.4405 2.80832 1.7235 4.01132 1.7235C5.04032 1.7235 5.98232 2.238 5.98232 3.4755C5.98232 4.428 5.42132 4.866 4.53482 5.532C3.52532 6.2655 2.72582 7.122 2.78282 8.5125L2.78732 8.838C2.78889 8.93641 2.8291 9.03026 2.89925 9.09929C2.96941 9.16833 3.06389 9.20701 3.16232 9.207H4.37882C4.47827 9.207 4.57366 9.16749 4.64398 9.09716C4.71431 9.02684 4.75382 8.93146 4.75382 8.832V8.6745C4.75382 7.5975 5.16332 7.284 6.26882 6.4455C7.18232 5.751 8.13482 4.98 8.13482 3.3615C8.13482 1.095 6.22082 0 4.12532 0C2.22482 0 0.142819 0.885 0.000318985 3.429ZM2.33582 12.0735C2.33582 12.873 2.97332 13.464 3.85082 13.464C4.76432 13.464 5.39282 12.873 5.39282 12.0735C5.39282 11.2455 4.76282 10.6635 3.84932 10.6635C2.97332 10.6635 2.33582 11.2455 2.33582 12.0735Z"
                    fill="#A0A2AB"
                  />
                </svg>
              </div>
              <p className="ibmplexmono subtext comming-soon__subtext">
                Coming soon
              </p>
            </article>
          </div>
          <div
            style={{ width: "100%", marginTop: "40px", marginBottom: "40px" }}
          >
            <ProgressBar balance={balance} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
