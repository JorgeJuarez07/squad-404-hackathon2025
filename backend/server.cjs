const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenPayments = require("@interledger/open-payments");
const crypto = require("crypto");
const axios = require("axios");
const { createAuthenticatedClient, isFinalizedGrant } =
  OpenPayments.default || OpenPayments;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const PORT = 8673;

// --- CONFIG OPEN PAYMENTS ---
const KEY_ID = "03f94001-ff12-4bc9-a1f9-3ef0af7db36a";
const WALLET_ADDRESS = "https://ilp.interledger-test.dev/39d4e82c";
const PRIVATE_KEY_PATH = "private.key";

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


let client;
(async () => {
  client = await createAuthenticatedClient({
    walletAddressUrl: WALLET_ADDRESS,
    privateKey: PRIVATE_KEY_PATH,
    keyId: KEY_ID,
  });
  console.log("Cliente Open Payments inicializado.");
})();

// ---------------------- ENDPOINT DE PAGO ----------------------
app.post("/api/pay", async (req, res) => {
  const { buyerWallet, amountsPerSeller } = req.body;
  if (!buyerWallet || !amountsPerSeller) {
    return res.status(400).json({ error: "Se requieren 'buyerWallet' y 'amountsPerSeller'." });
  }

  try {
    const senderWallet = await client.walletAddress.get({ url: buyerWallet });
    const redirects = [];

    for (const sellerWalletUrl of Object.keys(amountsPerSeller)) {
      try {
        const receiverWallet = await client.walletAddress.get({ url: sellerWalletUrl });

        const incomingGrant = await client.grant.request(
          { url: receiverWallet.authServer },
          { access_token: { access: [{ type: "incoming-payment", actions: ["create"] }] } }
        );
        if (!isFinalizedGrant(incomingGrant)) throw new Error("Incoming grant no finalizado");

        const incomingPayment = await client.incomingPayment.create(
          { url: receiverWallet.resourceServer, accessToken: incomingGrant.access_token.value },
          {
            walletAddress: receiverWallet.id,
            incomingAmount: {
              assetCode: receiverWallet.assetCode,
              assetScale: receiverWallet.assetScale,
              value: amountsPerSeller[sellerWalletUrl],
            },
          }
        );

        const quoteGrant = await client.grant.request(
          { url: senderWallet.authServer },
          { access_token: { access: [{ type: "quote", actions: ["create"] }] } }
        );
        if (!isFinalizedGrant(quoteGrant)) throw new Error("Quote grant no finalizado");

        const quote = await client.quote.create(
          { url: senderWallet.resourceServer, accessToken: quoteGrant.access_token.value },
          { walletAddress: senderWallet.id, receiver: incomingPayment.id, method: "ilp" }
        );

       
        const nonce = crypto.randomUUID();
        const outgoingGrant = await client.grant.request(
          { url: senderWallet.authServer },
          {
            access_token: {
              access: [
                {
                  type: "outgoing-payment",
                  actions: ["create"],
                  identifier: senderWallet.id,
                  limits: { debitAmount: quote.debitAmount }
                }
              ]
            },
            interact: {
              start: ["redirect"],
            }
          }
        );

        redirects.push({
          sellerWallet: sellerWalletUrl, 
          senderWallet: {
            id: senderWallet.id,
            resourceServer: senderWallet.resourceServer,
            authServer: senderWallet.authServer,
            assetCode: senderWallet.assetCode,
            assetScale: senderWallet.assetScale
          },
          incomingPayment,
          quote,
          outgoingGrant,
          nonce,
          redirectUri: outgoingGrant.interact?.redirectUri || outgoingGrant.interact?.startUri
        });



      } catch (err) {
        console.error(`Error procesando vendedor ${sellerWalletUrl}:`, err);
      }
    }

    res.json({ message: "Transacciones generadas", redirects });

  } catch (error) {
    console.error("Error general en /api/pay:", error);
    res.status(500).json({ error: error.message });
  }
});

// ----------------- ENDPOINT DE FINALIZAR PAGO -----------------
app.post("/api/pay/finalize", async (req, res) => {
  const { senderWallet, outgoingGrant, quote, buyerWallet } = req.body;

  if (!senderWallet || !outgoingGrant || !quote || !buyerWallet) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos de transacción completos (senderWallet, outgoingGrant, quote, buyerWallet)"
    });
  }

  try {

    const finalizedGrant = await client.grant.continue({
      url: outgoingGrant.continue.uri,
      accessToken: outgoingGrant.continue.access_token.value
    });


    if (!isFinalizedGrant(finalizedGrant)) {
      return res.json({ success: false, message: "Grant no finalizado correctamente" });
    }
const outgoingPaymentDetails = await client.outgoingPayment.create(
  { 
    url: senderWallet.resourceServer,
    accessToken: finalizedGrant.access_token.value 
  },
  { 
    walletAddress: senderWallet.id,
    quoteId: quote.id
  }
);

    res.json({
      success: true,
      outgoingPaymentId: outgoingPaymentDetails.id,
      details: outgoingPaymentDetails,
      senderWallet,
      buyerWallet
    });

  } catch (err) {
    res.json({ success: false, message: "Error finalizando pago", error: err.message });
  }
});


app.post("/.well-known/pay", (req, res) => {
  res.json({ interact: { result: "approved" } });
});

app.get("/finish", (req, res) => {
  res.send("Autorización completada automáticamente");
});


// ---------------------- CALLBACK DE INTERACCIÓN ----------------------
app.post("/.well-known/pay", (req, res) => {
  console.log("Solicitud automática de grant recibida:", req.body);
  res.json({ interact: { result: "approved" } });
});

// ---------------------- REDIRECT CALLBACK ----------------------
app.get("/finish", (req, res) => {
  console.log("Redirección de autorización recibida:", req.query);
  res.send("Autorización completada automáticamente");
});

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
