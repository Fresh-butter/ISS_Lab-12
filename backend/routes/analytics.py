from fastapi import APIRouter
from fastapi.responses import JSONResponse
import numpy as np
import matplotlib.pyplot as plt
import io
import base64
from db import init_db # by SHUBHI added this line to import init_db
router = APIRouter()

#async def get_items_collection():
async def get_items_collection(db=Depends(init_db)): #  by SHUBHI changed the above as this i.e. corrected dependency injection for database connection
   # from db import init_db    || by SHUBHI commented out this line
    #return init_db()["items_collection"]  || by SHUBHI commented out this line
    return db["items_collection"] # by SHUBHI changed above as this


async def get_users_collection():
    from db import init_db
    return init_db()["users_collection"]

@router.get("/")
async def get_analytics():
    
    items_collection = await get_items_collection()
    users_collection = await get_users_collection()
    
    
    items = []
    async for item in items_collection.find():
        items.append(item)
    # damm this is the last lab
    # Initialize as empty array instead of hardcoded values by navneet 
    users = []
    async for user in users_collection.find():
        users.append(user)
    
    item_count = len(items)
    user_count = len(users)
    
    item_name_lengths = np.array([len(item["names"]) for item in items]) if items else np.array([])
    user_username_lengths = np.array([len(user["usernames"]) for user in users]) if users else np.array([])
    
    stats = {
        "item_count": item_count,
        "user_count": user_count,
        "avg_item_name_length": float(item_name_lengths.mean()) if item_name_lengths.size > 0 else 0.0,
        "avg_user_username_length": float(user_username_lengths.mean()) if user_username_lengths.size > 0 else 0.0,
        "max_item_name_length": int(item_name_lengths.max()) if item_name_lengths.size > 0 else 0,
        "max_user_username_length": int(user_username_lengths.max()) if user_username_lengths.size > 0 else 0,
    }
    
    
    plt.figure(figsize=(8, 6))
    
    if item_name_lengths.size > 0:
        plt.hist(item_name_lengths, bins=10, alpha=0.5, label="Item Names", color="blue")
    if user_username_lengths.size > 0:
        plt.hist(user_username_lengths, bins=10, alpha=0.5, label="Usernames", color="green")
    
    plt.title("Distribution of Name Lengths")
    plt.xlabel("Length")
    plt.ylabel("Frequency")
    plt.legend()
    # Chocolate Question: Is there a modern alternative to REST that avoids over-fetching and under-fetching of data?
    
    buffer = io.BytesIO()
    plt.savefig(buffer, format="png")
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
    plt.close()
    
    return JSONResponse({
        "stats": stats
    })

# by SHUBHI added the line from db import init_db to import init_db
# by SHUBHI changed async def get_items_collection(): to async def get_items_collection(db=Depends(init_db)):