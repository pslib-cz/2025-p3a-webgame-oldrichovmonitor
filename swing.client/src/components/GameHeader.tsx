import { Link } from "react-router-dom";
import { useBalance } from "../context/BalanceContext";
import BalanceIcon from "./BalanceIcon";

interface GameHeaderProps {
  title: string;
  subtitle: string;
}

const GameHeader = ({ title, subtitle }: GameHeaderProps) => {
  const { balance } = useBalance();

  return (
    <>
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
              <BalanceIcon />
              <p className="subtitle ibmplexmono white">
                Balance: {balance.toFixed(2)}$
              </p>
            </div>
            <Link
              to="/homepage"
              className="subtitle hoverable balance--order-switch"
            >
              Exit to Arcade
            </Link>
          </div>
        </div>
      </header>
      <div className="header__title-wrapper page__section game-page__header-title-wrapper">
        <h1 className="game-title">{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>
    </>
  );
};

export default GameHeader;
