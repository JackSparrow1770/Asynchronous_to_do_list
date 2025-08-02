from fastapi import FastAPI
from contextlib import asynccontextmanager
from .database import client
from .routers import todos

@asynccontextmanager
async def lifespan(app: FastAPI):
    # on startup
    app.state.mongodb_client = client
    app.state.database = client.todos
    yield
    # on shutdown
    app.state.mongodb_client.close()

app = FastAPI(lifespan=lifespan)

app.include_router(todos.router, tags=["todos"], prefix="/todo")

