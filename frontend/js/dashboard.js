const API_URL = "https://finance-dashboard-3juc.onrender.com/api";

/* ------------------------------------------------------
   AUTH TOKEN HEADER
------------------------------------------------------ */
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
    const token = localStorage.getItem("token");
    return token ? { "Authorization": "Bearer " + token } : {};
}

/* ------------------------------------------------------
   GET
------------------------------------------------------ */
async function getData(endpoint) {
    try {
        const res = await fetch(`${API_URL}/${endpoint}`, {
            headers: { "Content-Type": "application/json", ...getTokenHeader() },
        });
        return await res.json();
    } catch (err) {
        console.error("GET Error:", err);
        return null;
    }
}

/* ------------------------------------------------------
   POST
------------------------------------------------------ */
async function postData(endpoint, data) {
    try {
        const res = await fetch(`${API_URL}/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...getTokenHeader() },
            body: JSON.stringify(data),
        });
        return await res.json();
    } catch (err) {
        console.error("POST Error:", err);
        return null;
    }
}
// ⬇️ ADD IT RIGHT HERE
function editTransaction(id) {
    window.location.href = `transactions.html?edit=${id}`;
}
async function deleteTransaction(id) {
    if (!confirm("Delete this transaction?")) return;

    const res = await postData(`transactions/delete/${id}`, {});

    if (res?.msg) {
        loadDashboard(); // refresh table
    } else {
        alert("Failed to delete");
    }
}


/* ------------------------------------------------------
   DELETE
------------------------------------------------------ */
async function deleteData(endpoint) {
    try {
        const res = await fetch(`${API_URL}/${endpoint}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", ...getTokenHeader() },
        });
        return await res.json();
    } catch (err) {
        console.error("DELETE Error:", err);
        return null;
    }
}

/* ------------------------------------------------------
   LOGOUT BUTTON
------------------------------------------------------ */
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

document.getElementById("mobileLogoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

/* ------------------------------------------------------
   MOBILE MENU
------------------------------------------------------ */
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.getElementById("overlay");

menuBtn?.addEventListener("click", () => {
    mobileMenu.classList.toggle("-translate-x-full");
    overlay.classList.toggle("hidden");
});

/* ------------------------------------------------------
   LOAD DASHBOARD
------------------------------------------------------ */
async function loadDashboard() {
    const res = await getData("dashboard");
    if (!res) return console.error("❌ Failed to load dashboard");

    /* SUMMARY */
    document.getElementById("totalIncome").textContent = `₹${res.totalIncome || 0}`;
    document.getElementById("totalExpense").textContent = `₹${res.totalExpense || 0}`;
    document.getElementById("savings").textContent = `₹${res.savings || 0}`;
    document.getElementById("totalTx").textContent = res.transactions?.length || 0;

    /* TRANSACTIONS TABLE */
  /* TRANSACTIONS TABLE */
const txTable = document.getElementById("transactionsTable");
txTable.innerHTML = "";

if (res.transactions?.length) {
    // Take only the 5 most recent transactions
    const recentTx = res.transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // sort by newest first
        .slice(0, 5);

    recentTx.forEach((tx) => {
        const tr = document.createElement("tr");
        tr.className = "border-b";

        tr.innerHTML = `
            <td class="py-2 px-4">${new Date(tx.date).toLocaleDateString()}</td>
            <td class="py-2 px-4 ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}">${tx.type}</td>
            <td class="py-2 px-4">${tx.category}</td>
            <td class="py-2 px-4 ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}">₹${tx.amount}</td>
           
        `;

        txTable.appendChild(tr);
    });
} else {
    txTable.innerHTML = `<tr><td colspan="5" class="py-3 text-center text-gray-500">No transactions found</td></tr>`;
}


    /* WEEKLY SPENDING CHART */
    const weeklyCtx = document.getElementById("weeklySpendingChart");
    if (window.weeklyChart) window.weeklyChart.destroy();
    window.weeklyChart = new Chart(weeklyCtx, {
        type: "bar",
        data: {
            labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            datasets: [
                {
                    label: "Expenses",
                    data: res.weeklyData || [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: "rgba(99,102,241,0.9)",
                },
            ],
        },
        options: { scales: { y: { beginAtZero: true } } },
    });

    /* FORECAST CHART */
    const forecastCtx = document.getElementById("savingsForecastChart");
    if (window.forecastChart) window.forecastChart.destroy();
    window.forecastChart = new Chart(forecastCtx, {
        type: "line",
        data: {
            labels: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ],
            datasets: [
                {
                    label: "Projected Savings",
                    data: res.forecastData || Array(12).fill(0),
                    borderColor: "green",
                    backgroundColor: "rgba(16,185,129,0.2)",
                    fill: true,
                },
            ],
        },
    });

    /* ALERTS */
    const alertsList = document.getElementById("alertsList");
    alertsList.innerHTML = "";
    if (res.alerts?.length) {
        res.alerts.forEach((alert) => {
            const li = document.createElement("li");
            li.textContent = alert;
            alertsList.appendChild(li);
        });
    } else {
        alertsList.innerHTML = `<li>No alerts</li>`;
    }

    /* QUOTE */
    document.getElementById("quoteText").textContent =
        res.motivation?.text || "Stay positive and keep saving!";
    document.getElementById("quoteAuthor").textContent =
        res.motivation?.author || "";
}



/* ------------------------------------------------------
   GOALS
------------------------------------------------------ */
document.getElementById("addGoalForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("goalTitle").value;
    const targetAmount = Number(document.getElementById("goalAmount").value);

    const res = await postData("goals/add", { title, targetAmount });
    if (res?.goal) {
        loadGoals();
        e.target.reset();
    } else {
        alert("❌ Failed to add goal");
    }
});
async function addBillListener(e) {
    e.preventDefault();

    const title = document.getElementById("billTitle").value;
    const amount = Number(document.getElementById("billAmount").value);
    const dueDate = document.getElementById("billDueDate").value;

    const res = await postData("bills/add", { title, amount, dueDate });

    if (res?.bill) {
        loadBills();
        e.target.reset();
    } else {
        alert("❌ Failed to add bill");
    }
}



async function loadGoals() {
    const dashboard = await getData("dashboard");
    const goals = dashboard?.goals || [];

    const list = document.getElementById("goalsList");
    list.innerHTML = "";

    if (goals.length) {
        goals.forEach((goal) => {
            const li = document.createElement("li");
            li.className = "border-b py-2 flex justify-between";

            li.innerHTML = `
                <span>${goal.title} — ₹${goal.targetAmount}</span>
                <button onclick="deleteGoal('${goal._id}')" class="text-red-500 hover:text-red-700">🗑️</button>
            `;

            list.appendChild(li);
        });
    } else {
        list.innerHTML = "<li>No goals added</li>";
    }
}

async function deleteGoal(id) {
    if (!confirm("Delete this goal?")) return;
    const res = await postData(`goals/delete/${id}`);
    if (res?.msg) loadGoals();
}

/* ------------------------------------------------------
   BILLS
------------------------------------------------------ */
document.getElementById("addBillForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("billTitle").value;
    const amount = Number(document.getElementById("billAmount").value);
    const dueDate = document.getElementById("billDueDate").value;

    const res = await postData("bills/add", { title, amount, dueDate });

    if (res?.bill) {
        loadBills();
        e.target.reset();
    } else {
        alert("❌ Failed to add bill");
    }
});

async function loadBills() {
    const res = await getData("bills");

    const list = document.getElementById("billsList");
    list.innerHTML = "";

    if (res?.bills?.length) {
        res.bills.forEach((bill) => {
            const li = document.createElement("li");
            li.className = "border rounded-xl p-3 mb-2 flex justify-between items-center shadow-sm hover:shadow-md transition bg-white";

            li.innerHTML = `
                <div>
                    <p class="font-semibold text-gray-800">${bill.title}</p>
                    <p class="text-gray-500 text-sm">₹${bill.amount} • Due: <span class="text-red-500 font-medium">${new Date(bill.dueDate).toLocaleDateString()}</span></p>
                </div>
                <div class="flex gap-2">
                 
                    <button onclick="deleteBill('${bill._id}')" class="text-red-500 hover:text-red-700">🗑️</button>
                </div>
            `;

            list.appendChild(li);
        });
    } else {
        list.innerHTML = "<li class='text-gray-500'>No upcoming bills</li>";
    }
}




async function deleteBill(id) {
    if (!confirm("Delete this bill?")) return;
    const res = await deleteData(`bills/delete/${id}`);
    if (res?.msg) loadBills();
}

/* ------------------------------------------------------
   INITIAL LOAD
------------------------------------------------------ */
loadDashboard();
loadGoals();
loadBills();
