from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username', 'email', 'phone', 'password', 'password2')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})

        if User.objects.filter(email=data.get('email')).exists():
            raise ValidationError("Este correo electrónico ya está registrado.")
        if data.get('phone') and User.objects.filter(phone=data['phone']).exists():
            raise ValidationError("Este número de teléfono ya está registrado.")

        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    username_or_email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username_or_email = data.get('username_or_email')
        password = data.get('password')

        if not username_or_email or not password:
            raise serializers.ValidationError("Debe ingresar un nombre de usuario/email y una contraseña.")

        user = authenticate(username=username_or_email, password=password)
        if not user:
            try:
                user = User.objects.get(email=username_or_email)
                user = authenticate(username=user.username, password=password)
            except User.DoesNotExist:
                pass

        if not user:
            raise serializers.ValidationError("Credenciales inválidas, por favor intente de nuevo.")

        data['user'] = user
        return data