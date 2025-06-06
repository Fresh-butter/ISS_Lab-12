const baseURL = "http://localhost:8000";

async function loadItems(searchTerm = "") {
  const res = await fetch(`${baseURL}/items`);
  const data = await res.json();
  const list = document.getElementById("itemList");
  list.innerHTML = "";

  const filteredItems = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  document.getElementById("itemCount").textContent = `Total items: ${filteredItems.length}`;

  filteredItems.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name}: ${item.description}`;
    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => deleteItem(item._id);
    li.appendChild(del);
    list.appendChild(li);
  });
}

async function deleteItem(id) {
  await fetch(`${baseURL}/items/${id}`, { method: "DELETE" }); // by SHUBHI: mistake-POST corrected- changed from POST to DELETE
  loadItems(document.getElementById("search").value); 
}

document.getElementById("search").addEventListener("input", (e) => {
  loadItems(e.target.value); 
});

document.getElementById("itemForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  await fetch(`${baseURL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description })
  });
  e.target.reset();
  loadItems(document.getElementById("search").value);
});

loadItems();

// by SHUBHI in the block
// async function deleteItem(id) {
//   await fetch(`${baseURL}/items/${id}`, { method: "DELETE" }); // by SHUBHI: mistake-POST corrected- changed from POST to DELETE
//   loadItems(document.getElementById("search").value); 
// }
// changed POST to DELETE
