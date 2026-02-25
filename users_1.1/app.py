from sqlmodel import create_engine, SQLModel
from fastapi import FastAPI
from models import *
from config.database import engine
from routers import user
from routers import auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Users Test Project")

# Список разрешенных источников (доменов)
origins = [
    "http://localhost:5173",  # Frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # разрешить все: ["*"]
    allow_credentials=True, # не знаю для чего
    allow_methods=["*"],    # разрешить все методы (GET, POST и т.д.)
    allow_headers=["*"],    # разрешить все заголовки 
)

def create_db():
    SQLModel.metadata.create_all(engine)


app.include_router(user.router, prefix="/users", tags=["users"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.on_event("startup")
def on_startup():
    create_db()

@app.get("/")
async def root():
    return {"message": "Users Project"}
