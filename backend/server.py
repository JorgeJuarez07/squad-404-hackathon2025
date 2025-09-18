import os
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from urllib.parse import urlencode
from flask_cors import CORS

# Cargar variables de entorno desde .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Variables de entorno
ZITADEL_CLIENT_ID = os.getenv("ZITADEL_CLIENT_ID")
ZITADEL_CLIENT_SECRET = os.getenv("ZITADEL_CLIENT_SECRET")
ZITADEL_ISSUER = os.getenv("ZITADEL_ISSUER")
ZITADEL_REDIRECT_URI = os.getenv("ZITADEL_REDIRECT_URI")

@app.route("/auth/token", methods=["POST"])
def auth_token():
    """
    Intercambia un código de autorización por tokens de ZITADEL.
    """
    data = request.json
    code = data.get("code")
    code_verifier = data.get("code_verifier")

    print("🔁 Solicitud a /auth/token recibida")

    if not code:
        print("❌ No se proporcionó un código de autorización.")
        return jsonify({"error": "No code provided"}), 400

    if not code_verifier:
        print("❌ No se proporcionó el code_verifier.")
        return jsonify({"error": "No code_verifier provided"}), 400

    print("✅ Código recibido:", code)
    print("✅ Code verifier recibido:", code_verifier)

    try:
        # Preparar datos para el intercambio de token
        payload = {
            "grant_type": "authorization_code",
            "client_id": ZITADEL_CLIENT_ID,
            "code": code,
            "redirect_uri": ZITADEL_REDIRECT_URI,
            "code_verifier": code_verifier
        }

        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }

        token_url = f"{ZITADEL_ISSUER}/oauth/v2/token"
        print("🌐 URL del token endpoint:", token_url)
        print("📦 Datos enviados:", payload)

        response = requests.post(token_url, data=urlencode(payload), headers=headers)
        response.raise_for_status()

        tokens = response.json()
        print("✅ Tokens recibidos correctamente")
        return jsonify(tokens)

    except requests.exceptions.HTTPError as http_err:
        print("❌ Error HTTP al obtener el token:")
        print("Código de estado:", response.status_code)
        print("Respuesta:", response.text)
        return jsonify({"error": "Token exchange failed", "details": response.text}), 500

    except requests.exceptions.RequestException as e:
        print("❌ Error en la solicitud al servidor de tokens:", e)
        return jsonify({"error": "Token exchange failed", "details": str(e)}), 500

@app.route("/me", methods=["GET"])
def get_user_info():
    """
    Obtiene información del usuario usando un access token válido.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        print("❌ No se proporcionó token en Authorization Header.")
        return jsonify({"error": "No token provided"}), 401

    try:
        headers = {
            "Authorization": auth_header
        }

        print("🔍 Obteniendo info del usuario desde:", f"{ZITADEL_ISSUER}/oidc/v1/userinfo")
        response = requests.get(f"{ZITADEL_ISSUER}/oidc/v1/userinfo", headers=headers)
        response.raise_for_status()

        user_info = response.json()
        print("✅ Información del usuario obtenida correctamente")
        return jsonify(user_info)

    except requests.exceptions.RequestException as e:
        print("❌ Error al obtener la información del usuario:", e)
        return jsonify({"error": "Invalid token"}), 401

if __name__ == "__main__":
    print("🚀 Servidor Flask ejecutándose en http://localhost:4000")
    app.run(port=4000)
