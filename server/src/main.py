from fastapi import FastAPI, WebSocket, WebSocketDisconnect, status
from fastapi.responses import HTMLResponse
from pathlib import Path

from models.types import ConnectionEntry
import models.schemas as schemas

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.active_users: dict[str, ConnectionEntry] = {}

    async def connect(self, username: str, websocket: WebSocket):
        if username in self.active_users:
            return False
        await websocket.accept()
        self.active_users[username] = {'socket': websocket, 'pair': None}
        return True

    def add_pair(self, username1: str, username2: str):
        self.active_users[username1]['pair'] = username2
        self.active_users[username2]['pair'] = username1

    def disconnect(self, username: str):
        pair = self.active_users[username]['pair']
        self.active_users[pair]['pair'] = None
        self.active_users.pop(username)

    async def send_personal_message(self, message: dict[str,any], websocket: WebSocket):
        await websocket.send_json(message)



manager = ConnectionManager()


@app.get("/")
async def get():
    base_dir = Path(__file__).parent 
    html_path = base_dir / "static" / "index.html"
    return HTMLResponse(html_path.read_text())


@app.websocket("/ws/{client_username}")
async def websocket_endpoint(websocket: WebSocket, client_username: str):
    connected = await manager.connect(client_username, websocket)
    if not connected:
        await websocket.accept()
        res = schemas.WebSocketConnectRes(status=False, 
                                          message='Error: Username is already taken.')
        await websocket.send_json(res.model_dump())
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            await manager.send_personal_message(f"You wrote: {data}", websocket)

    except WebSocketDisconnect:
        manager.disconnect(client_username)
        await manager.broadcast(f"Client #{client_username} left the chat")