import { Route, Routes } from "react-router-dom";
import "./css/main.css";
import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import MinesDimonds from "./pages/MinesDimonds";
import TimeSplit from "./pages/TimeSplit";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LogInPage />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/mines" element={<MinesDimonds />} />
      <Route path="/timesplit" element={<TimeSplit />} />
    </Routes>
  );
}

export default App;
