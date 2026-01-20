import { Route, Routes } from "react-router-dom";
import "./css/main.css";
import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import MinesDimonds from "./pages/MinesDimonds";
import TimeSplit from "./pages/TimeSplit";
import MemoryPattern from "./pages/MemoryPattern";
import PrecisionSlider from "./pages/PrecisionSlider";
import { useState } from "react";
function App() {
  const [username, setUsername] = useState("")
  const [balance, setBalance] = useState<number>(1000)
  return (
    <Routes>
      <Route path="/" element={<LogInPage setUsername={setUsername} setBalance={setBalance} balance={balance}/>} />
      <Route path="/homepage" element={<HomePage username={username} balance={balance}/>}/>
      <Route path="/mines" element={<MinesDimonds  setBalance={setBalance}/>} />
      <Route path="/timesplit" element={<TimeSplit  setBalance={setBalance}/>} />
      <Route path="/memmorypattern" element={<MemoryPattern setBalance={setBalance}/>}/>
      <Route path="/precisionslider" element={<PrecisionSlider setBalance={setBalance}/>}/>
    </Routes>
  );
}

export default App;
