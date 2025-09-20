import os
import requests
from dotenv import load_dotenv

from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

# Cargar las variables de entorno desde .env
load_dotenv()

class ZitadelAuthViewSet(ViewSet):
    """
    ViewSet para manejar la autenticación con ZITADEL.
    """
    # Obtener las variables de entorno
    zitadel_client_id = os.getenv("ZITADEL_CLIENT_ID")
    zitadel_client_secret = os.getenv("ZITADEL_CLIENT_SECRET")
    zitadel_issuer = os.getenv("ZITADEL_ISSUER")
    zitadel_redirect_uri = os.getenv("ZITADEL_REDIRECT_URI")

    @action(detail=False, methods=['post'], url_path='token')
    def get_token(self, request):
        """
        Intercambia un código de autorización por tokens.
        """
        code = request.data.get('code')
        if not code:
            return Response({"error": "No se proporcionó un código"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = {
                "grant_type": "authorization_code",
                "client_id": self.zitadel_client_id,
                "client_secret": self.zitadel_client_secret,
                "code": code,
                "redirect_uri": self.zitadel_redirect_uri,
            }

            response = requests.post(
                f"{self.zitadel_issuer}/oauth/v2/token",
                data=data
            )
            response.raise_for_status()
            
            return Response(response.json())
        except requests.exceptions.RequestException as e:
            return Response({"error": "Fallo en el intercambio de token"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='me')
    def get_user_info(self, request):
        """
        Obtiene información del usuario usando un token.
        """
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return Response({"error": "No se proporcionó un token"}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            headers = {"Authorization": auth_header}
            response = requests.get(
                f"{self.zitadel_issuer}/oidc/v1/userinfo",
                headers=headers
            )
            response.raise_for_status()

            return Response(response.json())
        except requests.exceptions.RequestException as e:
            return Response({"error": "Token inválido"}, status=status.HTTP_401_UNAUTHORIZED)