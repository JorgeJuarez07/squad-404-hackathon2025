from rest_framework import serializers
from .models import Conversation, Message
from django.contrib.auth import get_user_model

User = get_user_model()

# Serializador para el usuario (solo muestra el ID y nombre)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

# Serializador para los mensajes
class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True) # Muestra la info del remitente

    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'timestamp']

# Serializador para la conversación (incluye los mensajes anidados)
class ConversationSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'messages', 'created_at']

# Serializador para la creación de un nuevo mensaje
class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'content', 'conversation', 'sender']
        read_only_fields = ['sender'] # El remitente se asigna en la vista