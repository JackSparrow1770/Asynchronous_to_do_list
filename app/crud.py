from .database import todo_collection
from .models import Todo
from bson import ObjectId

async def get_todos():
    todos = 
    async for todo in todo_collection.find():
        todos.append(Todo(**todo))
    return todos