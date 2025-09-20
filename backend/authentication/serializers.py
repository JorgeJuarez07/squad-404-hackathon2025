# backend/authentication/serializers.py
from rest_framework import serializers

class AuthCodeSerializer(serializers.Serializer):
    code = serializers.CharField(required=True)