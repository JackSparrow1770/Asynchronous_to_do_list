from .database import todo_collection
from .models import Todo
from bson import ObjectId

async def get_todos():
    todos = []
    async for todo in todo_collection.find():
        todos.append(Todo(**todo))
    return todos

async def create_todo(todo_data: dict):
    new_todo = await todo_collection.insert_one(todo_data)
    created_todo = await todo_collection.find_one({"_id": new_todo.inserted_id})
    return created_todo

async def get_todo(id: str):
    todo = await todo_collection.find_one({"_id": ObjectId(id)})
    if todo:
        return todo
    
async def update_todo(id: str, data: dict):
    if not data:
        return None
    todo = await todo_collection.find_one({"_id": ObjectId(id)})
    if todo:
        updated_todo = await todo_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if updated_todo:
            return await todo_collection.find_one({"_id": ObjectId(id)})
        return None

async def delete_todo(id: str):
    todo = await todo_collection.find_one({"_id": ObjectId(id)})
    if todo:
        await todo_collection.delete_one({"_id": ObjectId(id)})
        return True
    return False