from fastapi import APIRouter, Body, status, HTTPException
from fastapi.responses import JSONResponse, Response
from typing import List

from .. import crud
from ..models import Todo, TodoUpdate
from ..schemas import TodoCreate


router = APIRouter()

@router.post("/", response_model=Todo)
async def create_todo_endpoint(todo: TodoCreate = Body(...)):
    new_todo = await crud.create_todo(todo.model_dump())
    return new_todo

@router.get("/", response_description="List all todos", response_model=List[Todo])
async def list_todos_endpoint():
    todos = await crud.get_todos()
    return todos

@router.get("/{id}", response_description="Get a single todo", response_model=Todo)
async def show_todo_endpoint(id: str):
    todo = await crud.get_todo(id)
    if todo is not None:
        return todo
    raise HTTPException(status_code=404, detail=f"Todo with id {id} not found")

@router.put("/{id}", response_model=Todo)
async def update_todo_endpoint(id: str, todo: TodoUpdate = Body(...)):
    updated_todo = await crud.update_todo(id, todo.model_dump(exclude_unset=True))
    if updated_todo:
        return updated_todo
    raise HTTPException(status_code=404, detail=f"Todo with id {id} not found")

@router.delete("/{id}", response_description="Delete a todo")
async def delete_todo_endpoint(id: str):
    deleted_todo = await crud.delete_todo(id)
    if deleted_todo:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    raise HTTPException(status_code=404, detail=f"Todo with id {id} not found")