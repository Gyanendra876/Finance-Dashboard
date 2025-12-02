const API_URL = "https://finance-dashboard-3juc.onrender.com/api";

const token = localStorage.getItem("token");

  // If token not found, user should NOT access the page
  if (!token) {
    window.location.replace("index.html");
  }

  // Prevent cached pages from appearing on BACK button
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });



function getTokenHeader() {
    const token = localStorage.getItem('token');
    return token ? { "Authorization": "Bearer " + token } : {};
}
// Track the transaction being edited
let editingTxId = null;
async function checkForEditMode() {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit");

    if (!editId) return;

    // Load the existing transaction
    const res = await getData(`edit/${editId}`);

    if (!res?.transaction) return;

    const tx = res.transaction;

    // Fill form
    document.querySelector("select[name='type']").value = tx.type;
    document.querySelector("input[name='category']").value = tx.category;
    document.querySelector("input[name='description']").value = tx.description;
    document.querySelector("input[name='amount']").value = tx.amount;
    document.querySelector("input[name='date']").value = tx.date.split("T")[0];

    // Store ID for update
    window.editingId = editId;

    // Change button text
    document.querySelector("#transactionForm button[type='submit']").textContent = "Update";
}


// Generic GET
async function getData(endpoint) {
    try {
        const res = await fetch(`${API_URL}/${endpoint}`, { headers: { "Content-Type": "application/json", ...getTokenHeader() } });
        return await res.json();
    } catch (err) {
        console.error("GET Error:", err);
        return null;
    }
}

// Generic POST
async function postData(endpoint, data) {
    try {
        const res = await fetch(`${API_URL}/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...getTokenHeader() },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (err) {
        console.error("POST Error:", err);
        return null;
    }
}

// Load transactions
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.getElementById("overlay");

menuBtn?.addEventListener("click", () => {
    mobileMenu.classList.toggle("-translate-x-full");
    overlay.classList.toggle("hidden");
});
// Add transaction
async function addTransaction(e) {
    e.preventDefault();
    const form = e.target;

    const data = {
        type: form.type.value,
        category: form.category.value,
        description: form.description.value,
        amount: Number(form.amount.value),
        date: form.date?.value || new Date()
    };

    let endpoint = "add";

    // UPDATE MODE
    if (window.editingId) {
        endpoint = `edit/${window.editingId}`;
    }

    const res = await postData(endpoint, data);

    if (res?.transaction || res?.msg === "Transaction updated") {
        window.location.href = "dashboard.html"; // go back
    } else {
        alert("Failed to save transaction");
    }
}



// Delete transaction
async function deleteTransaction(id) {
    if (!confirm('Are you sure?')) return;
    const res = await postData(`delete/${id}`, {});
    if (res?.msg) loadTransactions();
    else alert('Failed to delete transaction');
}
window.editTransaction = async function(id) {
    const res = await getData(`edit/${id}`); // <-- Correct backend route
    if (!res?.transaction) return alert("Transaction not found");

    const tx = res.transaction;
    const form = document.getElementById("transactionForm");

    // Fill form
    form.type.value = tx.type;
    form.category.value = tx.category;
    form.description.value = tx.description;
    form.amount.value = tx.amount;
    form.date.value = new Date(tx.date).toISOString().split("T")[0];

    // Change button text
    form.querySelector("button[type='submit']").textContent = "Update";

    // Save editing ID
    editingTxId = id;
};




// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

// Attach form submit
document.getElementById('transactionForm')?.addEventListener('submit', addTransaction);

// Initial load
loadTransactions();
lucide.createIcons();

