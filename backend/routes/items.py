from fastapi import APIRouter, HTTPException
from models import Item
from bson import ObjectId
#changed router={} to router=APIRouter() by Navneet
router = APIRouter()

async def get_items_collection():
    from db import init_db
    return init_db()["items_collection"]

@router.get("/")
async def get_items():
    collection = await get_items_collection()
    items = []
    async for item in collection.find():
        item["_id"] = str(item["_id"])
        items.append(item)
    return items

@router.post("/")
async def create_item(item: Item):
    collection = await get_items_collection()
    result = await collection.insert_one(item.dict())
    return {"id": str(result.inserted_id)}
# commented the second create_item function by navneet
# @router.post("/")
# async def create_item(item: Item):
#     return {"id": "Item Inserted"}
# I want a chocolate
@router.delete("/{item_id}")# by vishal @router.delete("/{item_id}/{item_details}")
async def delete_item(item_id: str):# by vishal async def delete_item(item_id: str, item_details:str):
    collection = await get_items_collection()
    result = await collection.delete_one({"_id": ObjectId(item_id)})
   # by vishal result2 = await collection.delete_one({"_id": ObjectId(item_details)})
    if result.deleted_count:
        return {"status": "deleted", "id": item_id}# by vishal return {"status": "deleted", "deleted_item":result2}
    raise HTTPException(status_code=404, detail="Item not found")