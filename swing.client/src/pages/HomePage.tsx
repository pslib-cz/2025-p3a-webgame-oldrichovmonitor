import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import GridLines from "../components/GridLines";
import Game from "../components/Game";
import Spinner from "../components/Spinner";
import BalanceIcon from "../components/BalanceIcon";
import { useBalance } from "../context/BalanceContext";
import { useSound } from "../context/SoundContext";
import ProgressBar from "../components/ProgressBar";

const GAME_DEFS = [
  {
    index: 0,
    name: "Mines & Diamonds",
    description: "Avoid mines and uncover shining diamonds.",
    route: "/mines",
  },
  {
    index: 1,
    name: "Time Split",
    description: "Press to stop time with precision.",
    route: "/timesplit",
  },
  {
    index: 2,
    name: "Memory Pattern",
    description: "Watch the sequence, then repeat it.",
    route: "/memmorypattern",
  },
  {
    index: 3,
    name: "Precision Slider",
    description: "Stop the slider in the target zone.",
    route: "/precisionslider",
  },
];

const HomePage = () => {
  const {
    balance,
    username,
    userId,
    unlockedGames,
    gameCosts,
    fetchUser,
    fetchCosts,
    updateUser,
    logout,
  } = useBalance();
  const { playClick, playSuccess, playError } = useSound();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    Promise.all([fetchUser(), fetchCosts()]).then(() => setLoading(false));
  }, [userId]);

  // Cost depends on how many games are already unlocked.
  // 0 unlocked → free, 1 unlocked → gameCosts[0], 2 unlocked → gameCosts[1], etc.
  const getUnlockCost = () => {
    const count = unlockedGames.length;
    if (count === 0) return 0; // first unlock is free
    return gameCosts[count - 1] ?? gameCosts[gameCosts.length - 1] ?? 0;
  };

  const handleUnlock = async (gameIndex: number) => {
    const cost = getUnlockCost();
    if (balance < cost) {
      playError();
      return;
    }
    const newBalance = balance - cost;
    const newUnlocked = [...unlockedGames, gameIndex];
    await updateUser(newBalance, newUnlocked);
    playSuccess();
  };

  if (loading)
    return (
      <div className="page">
        <Spinner text="Loading arcade..." />
      </div>
    );

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
              <BalanceIcon />
              <p className="subtitle ibmplexmono white">Balance: {balance}$</p>
            </div>
            <Link
              to="/"
              className="subtitle hoverable balance--order-switch sign-out-link"
              onClick={() => {
                playClick();
                logout();
              }}
              aria-label="Sign out"
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
            <BalanceIcon />
            <p className="subtitle ibmplexmono white">Balance: {balance}$</p>
          </div>
          <div className="home-page__games">
            {GAME_DEFS.map((game) => (
              <Game
                key={game.index}
                gameIndex={game.index}
                name={game.name}
                description={game.description}
                route={game.route}
                isLocked={!unlockedGames.includes(game.index)}
                balance={balance}
                unlockCost={getUnlockCost()}
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
          <div className="progress-bar-section">
            <ProgressBar balance={balance} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
