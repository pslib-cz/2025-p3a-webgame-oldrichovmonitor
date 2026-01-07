import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import GridLines from "../components/GridLines";

const LogInPage = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const onEnter = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!username.trim()) return; // require a name
    navigate("/", { state: { username } }); // go to HomePage with name
  };

  return (
    <div className="login-page page">
      <GridLines />
      <header className="login-page__header">
        <img
          className="logo"
          src="/images/logo.png"
          alt="Logo"
          width={186}
          height={135}
        />
      </header>
      <main className="login-page__content">
        <article className="login-page__main">
          <div className="login-page__card-body">
            <div className="login-page__card-header">
              <h2 className="login-page__title">Welcome Back</h2>
              <p className="subtitle">Enter the Swing Playground.</p>
            </div>
            <div className="login-page__input-group">
              <p className="input-label">USERNAME</p>
              <div className="input-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="icon--input"
                >
                  <path
                    d="M15.8332 17.5V15.8333C15.8332 14.9493 15.482 14.1014 14.8569 13.4763C14.2317 12.8512 13.3839 12.5 12.4998 12.5H7.49984C6.61578 12.5 5.76794 12.8512 5.14281 13.4763C4.51769 14.1014 4.1665 14.9493 4.1665 15.8333V17.5"
                    stroke="#677489"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.99984 9.16667C11.8408 9.16667 13.3332 7.67428 13.3332 5.83333C13.3332 3.99238 11.8408 2.5 9.99984 2.5C8.15889 2.5 6.6665 3.99238 6.6665 5.83333C6.6665 7.67428 8.15889 9.16667 9.99984 9.16667Z"
                    stroke="#677489"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Enter your gamertag"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <Link to="/" className="button">
              <p className="button__text">Enter Platform</p>
              <svg
                className="button__icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M5 12H19M19 12L13 18M19 12L13 6"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Link>
          </div>
          <p className="login-page__card-subtext">
            No account required. This is a demo.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default LogInPage;
