// API URL (KEEP ONLY THIS ONE)
const API_URL = "https://finance-dashboard-3juc.onrender.com/api";

// POST request helper
async function postData(endpoint, data) {
    try {
        const res = await fetch(API_URL + endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        return await res.json();
    } catch (err) {
        console.error("POST Error:", err);
        return { msg: "Network error" };
    }
}

// LOGIN
async function loginUser(email, password) {
    const res = await postData("auth/login", { email, password });

    console.log("Login response:", res); // always check

    if (res?.token) {
        localStorage.setItem("token", res.token);
        console.log("Token stored. Redirecting...");
        window.location.href = "dashboard.html";
    } else {
        alert(res?.message || "Login failed"); // changed from res.msg
    }
}

// SIGNUP
async function signupUser(name, email, password) {
    const res = await postData("auth/register", { name, email, password });

    console.log("Signup response:", res); // DEBUG

    if (res?.msg === "User registered") {
        alert("Account created successfully!");
        document.getElementById("loginBtn").click(); // show login tab
    } else {
        alert(res?.msg || "Signup failed");
    }
}

// Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            loginUser(loginForm.email.value, loginForm.password.value);
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            signupUser(
                signupForm.name.value,
                signupForm.email.value,
                signupForm.password.value
            );
        });
    }
});
