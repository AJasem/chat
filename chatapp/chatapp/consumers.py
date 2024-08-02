from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
import httpx  

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        user = text_data_json['user']

      
        await self.save_message(message, user)

    
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user': user
            }
        )

    async def save_message(self, message, user):
        async with httpx.AsyncClient() as client:
            response = await client.post('http://localhost:8000/api/send', json={
                'roomName': self.room_name,
                'value': message,
                'user': user
            })

            if response.status_code != 200:
                print("Failed to save message:", response.text)

    async def chat_message(self, event):
        message = event['message']
        user = event['user']

        await self.send(text_data=json.dumps({
            'message': message,
            'user': user
        }))
