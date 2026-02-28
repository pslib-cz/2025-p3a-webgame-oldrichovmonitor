import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import GridLines from "../components/GridLines";
import Spinner from "../components/Spinner";
import { useBalance } from "../context/BalanceContext";
import { useSound } from "../context/SoundContext";

const LogInPage = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUsername, setUserId } = useBalance();
  const { playClick } = useSound();

  const handleLogin = async (e: React.MouseEvent) => {
    playClick();
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("swing_user_id", String(data.userId));
        setUserId(data.userId);
        setUsername(usernameInput);
        navigate("/homepage");
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      console.error("Login failed", err);
      setError("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.MouseEvent) => {
    playClick();
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("swing_user_id", String(data.userId));
        setUserId(data.userId);
        setUsername(usernameInput);
        navigate("/homepage");
      } else {
        const body = await res.json().catch(() => null);
        setError(
          body?.message ||
            "Registration failed. Username may already be taken.",
        );
      }
    } catch (err) {
      console.error("Register failed", err);
      setError("Connection error.");
    } finally {
      setLoading(false);
    }
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
          <img
            src="/images/character_swing.png"
            className="login-character"
            alt="Character Swing"
          />
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.99984 9.16667C11.8408 9.16667 13.3332 7.67428 13.3332 5.83333C13.3332 3.99238 11.8408 2.5 9.99984 2.5C8.15889 2.5 6.6665 3.99238 6.6665 5.83333C6.6665 7.67428 8.15889 9.16667 9.99984 9.16667Z"
                    stroke="#677489"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Enter your gamertag"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  maxLength={15}
                  aria-label="Username"
                />
              </div>
            </div>
            <div className="login-page__input-group">
              <p className="input-label">PASSWORD</p>
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
                    d="M15.8332 9.16667H4.1665C3.24603 9.16667 2.49984 9.91286 2.49984 10.8333V16.6667C2.49984 17.5871 3.24603 18.3333 4.1665 18.3333H15.8332C16.7536 18.3333 17.4998 17.5871 17.4998 16.6667V10.8333C17.4998 9.91286 16.7536 9.16667 15.8332 9.16667Z"
                    stroke="#677489"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.8335 9.16667V5.83333C5.8335 4.72827 6.27248 3.66846 7.05388 2.88706C7.83529 2.10565 8.89509 1.66667 10.0002 1.66667C11.1052 1.66667 12.165 2.10565 12.9464 2.88706C13.7278 3.66846 14.1668 4.72827 14.1668 5.83333V9.16667"
                    stroke="#677489"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  maxLength={30}
                  aria-label="Password"
                />
              </div>
            </div>
            {error && (
              <div className="form-error" role="alert">
                <span className="error-icon" aria-hidden="true">
                  ⚠
                </span>
                {error}
              </div>
            )}
            {loading && <Spinner text="Please wait..." />}
            <div className="login-actions">
              {isRegistering ? (
                <>
                  <button
                    className="button"
                    onClick={handleRegister}
                    disabled={loading}
                    aria-label="Register account"
                  >
                    <p className="button__text">Register</p>
                  </button>
                  <button
                    className="button button--secondary"
                    onClick={() => {
                      playClick();
                      setIsRegistering(false);
                    }}
                    disabled={loading}
                    aria-label="Back to login"
                  >
                    <p className="button__text">Back to Login</p>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="button"
                    onClick={handleLogin}
                    disabled={loading}
                    aria-label="Log in"
                  >
                    <p className="button__text">Login</p>
                    <svg
                      className="button__icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 12H19M19 12L13 18M19 12L13 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    className="button button--secondary"
                    onClick={() => {
                      playClick();
                      setIsRegistering(true);
                    }}
                    disabled={loading}
                    aria-label="Switch to register"
                  >
                    <p className="button__text">Register</p>
                  </button>
                </>
              )}
            </div>
          </div>
          <p className="login-page__card-subtext">Login or register to play.</p>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default LogInPage;
