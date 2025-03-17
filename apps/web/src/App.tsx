import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import "./App.css";

function App() {
  return (
    <Router>
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </main>
  </Router>
  );
}

export default App;
