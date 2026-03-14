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

    async def forward_to_pair(self, username: str, message: dict[str,any]):
        pair = self.active_users[username].get('pair')
        if pair and pair in self.active_users:
            await self.send_personal_message(message, self.active_users[pair]['socket'])

    def disconnect(self, username: str):
        pair = self.active_users[username].get('pair')
        if pair and pair in self.active_users:
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
            try:
                request = schemas.ClientRequestAdapter.validate_json(data)
                print(f"Received valid request from {client_username}: {request}")
                
                match request.action:
                    case 'start-game':
                        # First, if the user was already paired, disconnect them
                        manager.disconnect(client_username)
                        manager.active_users[client_username] = {'socket': websocket, 'pair': None}
                        
                        unpaired = [user for user, info in manager.active_users.items() if info['pair'] is None and user != client_username]
                        if unpaired:
                            opponent = unpaired[0]
                            manager.add_pair(client_username, opponent)
   
                            await manager.send_personal_message(schemas.StartGameRes(opponent=opponent, symbol='X').model_dump(), manager.active_users[client_username]['socket'])
                            await manager.send_personal_message(schemas.StartGameRes(opponent=client_username, symbol='O').model_dump(), manager.active_users[opponent]['socket'])
                    case 'pair':
                        manager.add_pair(client_username, request.opponent)
                    case 'make-move':
                        await manager.forward_to_pair(client_username, request.model_dump())
                    case 'pointer-position':
                        await manager.forward_to_pair(client_username, request.model_dump())
            except Exception as e:
                print(f"Failed to parse request from {client_username}: {e}")

    except WebSocketDisconnect:
        manager.disconnect(client_username)
        await manager.broadcast(f"Client #{client_username} left the chat")