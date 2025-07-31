import motor.motor_asyncio
from .models import MONGO_DETAILS


client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.todos
todo_collection = database.get_collection("todos_collection")

