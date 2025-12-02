// bills.js
async function loadBills() {
    const token = localStorage.getItem('token');
    const data = await getData('bills', token);
    const container = document.getElementById('billsList');
    if (!data || !container) return;

    container.innerHTML = "";
    data.forEach(bill => {
        const div = document.createElement('div');
        div.className = "bg-white p-5 rounded-xl shadow hover:shadow-2xl transition";
        div.innerHTML = `
            <h3 class="font-semibold text-gray-700">${bill.name} - <span class="text-indigo-600">${bill.type}</span></h3>
            <p class="text-gray-600">₹${bill.amount}</p>
            <p class="text-gray-400 text-sm">Due: ${new Date(bill.dueDate).toLocaleDateString()}</p>
            <div class="mt-2 flex gap-2">
              <button onclick="editBill('${bill._id}')" class="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500">Edit</button>
              <button onclick="deleteBill('${bill._id}')" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Delete</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function editBill(id) {
    window.location.href = `addBill.html?id=${id}`;
}

async function deleteBill(id) {
    if (confirm("Are you sure you want to delete this bill?")) {
        const token = localStorage.getItem('token');
        const res = await deleteData(`bills/${id}`, token);
        if (res && res.msg) loadBills();
        else alert("Failed to delete bill!");
    }
}

document.addEventListener('DOMContentLoaded', loadBills);
