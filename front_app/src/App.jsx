import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./home/Home";
import Login from "./login/Login";
import Callback from "./login/Callback";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
