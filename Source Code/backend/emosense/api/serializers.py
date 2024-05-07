from rest_framework import serializers
from emotion.models import Users,Images,EmotionHistory
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.password = make_password(password)
        instance.save()
        return instance

class ImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = '__all__'
        
class EmotionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EmotionHistory
        fields = '__all__'