import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8673;

const ZITADEL_CLIENT_ID = "338010440426603890";
const ZITADEL_CLIENT_SECRET = "GImJzgaLTayTNyRCibLuojxRCKmdacaeYDHntC8JUXjqlrOPFSpywQaZlHGGXdeD";
const ZITADEL_ISSUER = "https://interle-jy3ptw.us1.zitadel.cloud";
const ZITADEL_REDIRECT_URI = "http://localhost:3000/callback";


// Endpoint para intercambiar code por tokens
app.post("/auth/token", async (req, res) => {
  const { code } = req.body;

  if (!code) return res.status(400).json({ error: "No code provided" });

  try {
    // Intercambiar el code por tokens
    const response = await axios.post(
      `${ZITADEL_ISSUER}/oauth/v2/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: ZITADEL_CLIENT_ID,
        client_secret: ZITADEL_CLIENT_SECRET,
        code,
        redirect_uri: ZITADEL_REDIRECT_URI,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const tokens = response.data;
    res.json(tokens);
  } catch (error) {
    // CORRECCIÓN: Se añade un registro de errores más detallado.
    // Esto te mostrará en la consola el error exacto que devuelve ZITADEL.
    if (error.response) {
      console.error("Detalles del error de ZITADEL:", error.response.data);
    } else {
      console.error("Mensaje de error:", error.message);
    }
    
    res.status(500).json({ 
      error: "Token exchange failed",
      // También se envía el detalle del error en la respuesta para facilitar la depuración
      details: error.response?.data || error.message 
    });
  }
});

// Endpoint protegido para obtener información del usuario
app.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  try {
    const response = await axios.get(`${ZITADEL_ISSUER}/oidc/v1/userinfo`, {
      headers: { Authorization: authHeader }, // authHeader debe ser "Bearer <token>"
    });
    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(401).json({ error: "Invalid token" });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

