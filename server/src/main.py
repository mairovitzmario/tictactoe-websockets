from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import TypeAdapter
from fastapi.responses import HTMLResponse
from pathlib import Path

from models.types import ConnectionEntry

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.active_users: dict[str, ConnectionEntry] = {}

    async def connect(self, username, websocket: WebSocket):
        await websocket.accept()
        self.active_users[username] = {'socket': websocket, 'pair': None}

    def add_pair(self, username1, username2):
        self.active_users[username1]['pair'] = username2
        self.active_users[username2]['pair'] = username1

    def disconnect(self, websocket: WebSocket):
        self.active_users.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for user in self.active_users:
            await self.active_users[user]['socket'].send_text(message)


manager = ConnectionManager()


@app.get("/")
async def get():
    base_dir = Path(__file__).parent 
    html_path = base_dir / "static" / "index.html"
    return HTMLResponse(html_path.read_text())

@app.get('/validate/{username}')
async def validateUsername(username: str) -> bool: 
    if username in manager.active_users:
        return False
    return True


 
@app.websocket("/ws/{client_username}")
async def websocket_endpoint(websocket: WebSocket, client_username: str):
    await manager.connect(client_username, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            await manager.send_personal_message(f"You wrote: {data}", websocket)
            await manager.broadcast(f"Client #{client_username} says: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client #{client_username} left the chat")