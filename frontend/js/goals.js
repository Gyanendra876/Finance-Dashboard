// goals.js

async function loadGoals() {
    const data = await getData('goals');
    const container = document.getElementById('goalsList');
    if (!data || !container) return;

    container.innerHTML = "";
    data.forEach(goal => {
        const div = document.createElement('div');
        div.className = "bg-white p-5 rounded-xl shadow hover:shadow-2xl transition flex justify-between items-center";
        div.innerHTML = `
            <div>
                <h3 class="font-semibold text-gray-700">${goal.title}</h3>
                <p class="text-gray-600">${goal.description || ''}</p>
                <p class="text-gray-400 text-sm">Target: ₹${goal.targetAmount}, Saved: ₹${goal.savedAmount}</p>
            </div>
            <div class="flex gap-2">
                <button onclick="completeGoal('${goal._id}')" class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">${goal.completed ? '✔ Completed' : 'Mark Complete'}</button>
                <button onclick="deleteGoal('${goal._id}')" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Delete</button>
            </div>
        `;
        container.appendChild(div);
    });
}

async function completeGoal(id) {
    const res = await postData(`goals/complete/${id}`, {});
    if (res && res.success) loadGoals();
    else alert("Failed to mark goal complete!");
}

async function deleteGoal(id) {
    if (confirm("Are you sure you want to delete this goal?")) {
        const res = await deleteData(`goals/${id}`);
        if (res && res.success) loadGoals();
        else alert("Failed to delete goal!");
    }
}

document.addEventListener('DOMContentLoaded', loadGoals);
