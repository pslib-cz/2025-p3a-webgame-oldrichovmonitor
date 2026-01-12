import { Route, Routes } from "react-router-dom";
import "./css/main.css";
import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import MinesDimonds from "./pages/MinesDimonds";
import TimeSplit from "./pages/TimeSplit";
import MemoryPattern from "./pages/MemoryPattern";
import PrecisionSlider from "./pages/PrecisionSlider";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LogInPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/mines" element={<MinesDimonds />} />
      <Route path="/timesplit" element={<TimeSplit />} />
      <Route path="/memmorypattern" element={<MemoryPattern/>}/>
      <Route path="/precisionslider" element={<PrecisionSlider/>}/>
    </Routes>
  );
}

export default App;
