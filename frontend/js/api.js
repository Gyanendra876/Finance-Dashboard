const API_URL = "https://finance-dashboard-3juc.onrender.com/api";

// POST
async function postData(endpoint, data) {
    try {
        const res = await fetch(`${API_URL}/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (err) {
        console.error("POST Error:", err);
        return null;
    }
}

// GET
async function getData(endpoint) {
    try {
        const res = await fetch(`${API_URL}/${endpoint}`, {
            credentials: "include"
        });
        return await res.json();
    } catch (err) {
        console.error("GET Error:", err);
        return null;
    }
}
