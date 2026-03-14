# Tic Tac Toe - Websocket

Online multiplayer tictactoe game in real time.

## Stack:

- Frontend:
  - React
- Backend
  - FastAPI
- Communication
  - Websockets

## How to run:

### Prerequisites

- Docker
- Docker Compose

### Using Docker (Recommended)

In the root directory run:

```bash
docker compose up
```

To stop running, use either:

- `docker compose down` - which will remove the containers
- `docker compose stop` - which will keep the containers

### Local Development (Without Docker)

**Backend:**

```bash
cd server
source .venv/bin/activate
pip install -r requirements.txt
fastapi dev src/main.py
```

**Frontend:**

```bash
cd tic-tac-toe
npm install
npm run dev
```

For running `server/src/generate_types.py` you will have to install a required npm package:

```bash
npm i -g json-schema-to-typescript
```
