import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      navigate("/login");
      return;
    }

    // Intercambiar el code por tokens en tu backend
    axios
      .post("http://localhost:4000/auth/token", { code })
      .then((res) => {
        localStorage.setItem("tokens", JSON.stringify(res.data));
        navigate("/"); // Redirige a home
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-xl">Autenticando...</h1>
    </div>
  );
};

export default Callback;
