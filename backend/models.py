from pydantic import BaseModel
# inserted BaseModel and changed name from int type to str type by navneet in models.py
class Item(BaseModel):
    name: str
    description: str

class User(BaseModel):
    username: str
    bio: str
    
    # You can raise your hands and give the answer to the chocolate question