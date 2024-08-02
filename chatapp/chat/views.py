from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Room, Message

@api_view(['POST'])
def checkroom(request):
    room_name = request.data.get('roomName')
    user_name = request.data.get('userName')

    room_exists = Room.objects.filter(name=room_name).exists()

    if room_exists:
         room = Room.objects.get(name=room_name)
         messages = Message.objects.filter(room=room)
         if messages:
             messages_data = [{'value': msg.value, 'user': msg.user, 'date': msg.date} for msg in messages]
             return Response({'room': room_name, 'messages': messages_data})
         else:
          return Response({'room':f'{room_name}'})
    else:
        new_room = Room.objects.create(name=room_name)
        return Response({'room': f'{new_room.name} created'})

@api_view(['POST'])
def send(request):
    room_name = request.data.get('roomName')
    value = request.data.get('value')
    user = request.data.get('user')

    try:
        room = Room.objects.get(name=room_name)
    except Room.DoesNotExist:
        return Response({'error': 'Room does not exist'}, status=400)

    message = Message.objects.create(room=room, value=value, user=user)
    return Response({'message': f'{message.value}'})
