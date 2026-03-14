from pydantic import BaseModel, Field, TypeAdapter
from typing import Literal, Union, Annotated

# Responses (from Server)
 
class WebSocketConnectRes(BaseModel):
    action: Literal['connect'] = 'connect'
    status: bool
    message: str | None

class StartGameRes(BaseModel):
    action: Literal['start-game'] = 'start-game'
    opponent: str
    symbol: Literal['O', 'X']


# Requests (from Clients)
class StartGameReq(BaseModel):
    action: Literal['start-game'] = 'start-game'
    

class PairUserReq(BaseModel):
    action: Literal['pair'] = 'pair'
    opponent: str

class MakeMoveReq(BaseModel):
    action: Literal['make-move'] = 'make-move'
    x: int
    y: int
    symbol: Literal['O', 'X']

class PointerPositionReq(BaseModel):
    action: Literal['pointer-position'] = 'pointer-position'
    x: int
    y: int

ClientRequest = Annotated[
    Union[StartGameReq, PairUserReq, MakeMoveReq, PointerPositionReq], 
    Field(discriminator='action')
]

ClientRequestAdapter = TypeAdapter(ClientRequest)
