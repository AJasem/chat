from django.db import models
from datetime import datetime

class Room(models.Model):
    name = models.CharField(max_length=200)
    def __str__(self):
        return self.name

class Message(models.Model):
    value = models.CharField(max_length=10000000)
    date = models.DateTimeField(default=datetime.now, blank=True)
    user = models.CharField(max_length=200, default='default_user')  
    room = models.ForeignKey(Room, related_name='messages', on_delete=models.CASCADE, default=1)

    def __str__(self):
        return self.value
