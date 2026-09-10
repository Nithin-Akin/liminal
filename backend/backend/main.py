from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth
from app.api.routes import agent
from app.api.routes import checkins
from app.api.routes import dashboard
from app.api.routes import profiles
from app.api.routes import tasks
from app.api.routes import transitions
from app.api.routes import research
from app.api.routes import sources
from app.api.routes import routing
from app.api.routes import banking
from app.core.config import DEV_AUTH

app = FastAPI(title="Liminal API")
app.state.dev_auth = DEV_AUTH

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(agent.router)
app.include_router(transitions.router)
app.include_router(checkins.router)
app.include_router(dashboard.router)
app.include_router(profiles.router)
app.include_router(tasks.router)
app.include_router(research.router)
app.include_router(sources.router)
app.include_router(routing.router)
app.include_router(banking.router)

@app.get("/")
def root():
    return {"status": "Liminal API is running"}
