from pydantic2ts import generate_typescript_defs
import models.schemas

generate_typescript_defs(
    "models.schemas", 
    "../../tic-tac-toe/src/shared/models.ts"
)
