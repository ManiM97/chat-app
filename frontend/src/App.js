import logo from "./logo.svg";
import "./App.css";
import Login from "./pages/login/Login";
import Chat from "./pages/chat/chat";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/chat" Component={Chat} />
      </Routes>
    </Router>
  );
}

export default App;
