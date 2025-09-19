import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Callback from "./pages/login/Callback";
import SingUp from "./pages/singup/Singup"
import ChatPage from "./pages/chat/chatPage";
import ConversationPage from "./pages/conversationPage/conversationPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/singup" element={<SingUp to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/chats/:chatId" element={<ConversationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
