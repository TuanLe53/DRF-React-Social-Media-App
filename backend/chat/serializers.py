from rest_framework import serializers
from .models import ChatRoom, ChatMessage, OnlineUser
from users.serializers import ProfileSerializer

class OnlineUserSerialize(serializers.ModelSerializer):
    class Meta:
        model = OnlineUser
        fields = "__all__"

class ChatRoomSerializer(serializers.ModelSerializer):
    member = ProfileSerializer(many=True, read_only=True)
    members = serializers.ListField(write_only=True)
    
    def create(self, validatedData):
        memberObject = validatedData.pop('members')
        chatRoom = ChatRoom.objects.create(**validatedData)
        chatRoom.member.set(memberObject)
        return chatRoom

    class Meta:
        model = ChatRoom
        exclude = ['id']
        
class ChatMessageSerializer(serializers.ModelSerializer):
    userName = serializers.SerializerMethodField()
    userImage = serializers.ImageField(source="user.avatar_img")
    
    class Meta:
        model = ChatMessage
        exclude = ['id', 'chat']
        
    def get_userName(self, Obj):
        return Obj.user.user.username