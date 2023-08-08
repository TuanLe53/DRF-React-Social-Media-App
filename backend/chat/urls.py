from django.urls import path
from .views import RoomAPI, MessageAPI, OnlineUserAPI, CreateRoomAPI

urlpatterns = [
    path("online-user/", OnlineUserAPI, name="online-users"),
    path("chat/<str:username>/rooms/", RoomAPI, name="rooms"),
    path("create-chat/<str:username>/<int:id>/", CreateRoomAPI, name="create-chat"),
    path("chat/<str:roomId>/messages/", MessageAPI, name="messages"),
]
