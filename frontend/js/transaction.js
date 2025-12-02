const API_URL = "https://finance-dashboard-3juc.onrender.com/api";
let editingId = null;

// TOKEN CHECK
const token = localStorage.getItem("token");
if (!token) window.location.replace("index.html");

function getTokenHeader() {
  const token = localStorage.getItem("token");
  return token ? { "Authorization": "Bearer " + token } : {};
}

// FETCH HELPERS
async function getData(endpoint) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`, { headers: { "Content-Type": "application/json", ...getTokenHeader() } });
    return await res.json();
  } catch (err) { console.error("GET Error:", err); return null; }
}

async function postData(endpoint, data) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getTokenHeader() },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) { console.error("POST Error:", err); return null; }
}

async function deleteData(endpoint) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...getTokenHeader() },
    });
    return await res.json();
  } catch (err) { console.error("DELETE Error:", err); return null; }
}

// LOGOUT
document.getElementById('logoutBtn')?.addEventListener('click', () => { localStorage.removeItem('token'); window.location.href = 'index.html'; });
document.getElementById('mobileLogoutBtn')?.addEventListener('click', () => { localStorage.removeItem('token'); window.location.href = 'index.html'; });

// MOBILE MENU
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.getElementById("overlay");
menuBtn?.addEventListener("click", () => { mobileMenu.classList.toggle("-translate-x-full"); overlay.classList.toggle("hidden"); });

// ADD / UPDATE TRANSACTION
document.getElementById("transactionForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const data = {
    type: form.type.value,
    category: form.category.value,
    description: form.description.value,
    amount: Number(form.amount.value),
    date: form.date.value || new Date()
  };

  let endpoint = "transactions/add";
  if (editingId) endpoint = `transactions/edit/${editingId}`;

  const res = await postData(endpoint, data);

  if (res?.transaction || res?.msg === "Transaction updated") {
    editingId = null;
    form.reset();
    form.querySelector("button[type='submit']").textContent = "Add";
    loadTransactions();
  } else {
    alert("Failed to save transaction");
  }
});

// LOAD TRANSACTIONS
async function loadTransactions() {
  const res = await getData("transactions");
  const table = document.getElementById("transactionsTable");
  table.innerHTML = "";

  if (!res?.transactions?.length) {
    table.innerHTML = `<tr><td colspan="5" class="text-center text-gray-500 py-3">No transactions found</td></tr>`;
    return;
  }

  res.transactions
    .sort((a,b)=>new Date(b.date)-new Date(a.date))
    .forEach(tx => {
      const tr = document.createElement("tr");
      tr.className = "border-b";
      tr.innerHTML = `
        <td class="py-2 px-4">${new Date(tx.date).toLocaleDateString()}</td>
        <td class="py-2 px-4 ${tx.type==='income'?'text-green-600':'text-red-600'}">${tx.type}</td>
        <td class="py-2 px-4">${tx.category}</td>
        <td class="py-2 px-4 ${tx.type==='income'?'text-green-600':'text-red-600'}">₹${tx.amount}</td>
        <td class="py-2 px-4 flex gap-2">
          <button onclick="editTransaction('${tx._id}')" class="text-blue-600 hover:underline">Edit</button>
          <button onclick="deleteTransaction('${tx._id}')" class="text-red-600 hover:underline">Delete</button>
        </td>
      `;
      table.appendChild(tr);
    });
}

// EDIT / DELETE
function editTransaction(id) {
  const form = document.getElementById("transactionForm");
  getData(`transactions/edit/${id}`).then(res => {
    if (!res?.transaction) return alert("Transaction not found");
    const tx = res.transaction;
    form.type.value = tx.type;
    form.category.value = tx.category;
    form.description.value = tx.description;
    form.amount.value = tx.amount;
    form.date.value = new Date(tx.date).toISOString().split("T")[0];
    form.querySelector("button[type='submit']").textContent = "Update";
    editingId = id;
  });
}

async function deleteTransaction(id) {
  if (!confirm("Delete this transaction?")) return;
  const res = await postData(`transactions/delete/${id}`, {});
  if (res?.msg) loadTransactions();
  else alert("Failed to delete");
}

// INITIAL LOAD
loadTransactions();
