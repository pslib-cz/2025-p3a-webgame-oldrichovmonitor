import { Route, Routes } from "react-router-dom";
import "./css/main.css";
import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import MinesDimonds from "./pages/MinesDimonds";
function App() {
  return (
    <Routes>
      <Route path="#" element={<LogInPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/mines" element={<MinesDimonds />} />
    </Routes>
  );
}

export default App;
