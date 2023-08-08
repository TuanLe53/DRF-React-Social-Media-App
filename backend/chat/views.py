from rest_framework.decorators import api_view
from rest_framework import  status
from rest_framework.response import Response
from .serializers import ChatRoomSerializer, ChatMessageSerializer, OnlineUserSerialize
from .models import ChatRoom, ChatMessage, OnlineUser
from users.models import Profile
from django.contrib.auth.models import User

import json

@api_view(["GET"])
def OnlineUserAPI(request):
    onlineUser = OnlineUser.objects.all()
    serializer = OnlineUserSerialize(onlineUser, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
def CreateRoomAPI(request, username, id):
    user_1 = Profile.objects.get(user=User.objects.get(username=username))
    user_2 = Profile.objects.get(id=id)
    room = ChatRoom.objects.filter(member=user_1).filter(member=user_2).distinct()
    
    if room.exists():
        room = ChatRoom.objects.get(roomId=str(room[0]))
        serializer = ChatRoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        room = ChatRoom()
        room.save()
        room.member.add(user_1, user_2)
        serializer = ChatRoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(["GET"])
def RoomAPI(request, username):
    user = User.objects.get(username=username)
    try:
        chatrooms = ChatRoom.objects.filter(member=Profile.objects.get(user=user))
    except ChatRoom.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = ChatRoomSerializer(chatrooms, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def MessageAPI(request, roomId):
    chatroom = ChatRoom.objects.get(roomId=roomId)
    messages = ChatMessage.objects.filter(chat=chatroom).order_by("-timestamp")
    serializer = ChatMessageSerializer(messages, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)