from django.contrib import admin
from .models import OnlineUser, ChatMessage, ChatRoom
# Register your models here.
admin.site.register(OnlineUser)
admin.site.register(ChatRoom)
admin.site.register(ChatMessage)   