from django.db import models
from users.models import Profile
from shortuuidfield import ShortUUIDField

# Create your models here.
class OnlineUser(models.Model):
    user = models.OneToOneField(Profile, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.user}"
    
class ChatRoom(models.Model):
	roomId = ShortUUIDField()
	type = models.CharField(max_length=10, default='DM')
	member = models.ManyToManyField(Profile)
	name = models.CharField(max_length=20, null=True, blank=True)

	def __str__(self):
		return self.roomId

class ChatMessage(models.Model):
	chat = models.ForeignKey(ChatRoom, on_delete=models.SET_NULL, null=True)
	user = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
	message = models.CharField(max_length=255)
	timestamp = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.message