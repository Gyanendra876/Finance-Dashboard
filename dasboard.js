const API = 'http://localhost:5000/api';
let token = localStorage.getItem('token');

async function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) { token = data.token; localStorage.setItem('token', token); loadDashboard(); }
  else alert(data.message);
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) { token = data.token; localStorage.setItem('token', token); loadDashboard(); }
  else alert(data.message);
}

async function addTransaction() {
  const amount = document.getElementById('amount').value;
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value;
  const res = await fetch(`${API}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ amount, type, category })
  });
  const data = await res.json();
  if (res.ok) fetchTransactions();
  else alert(data.message);
}

async function fetchTransactions() {
  const res = await fetch(`${API}/transactions`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const data = await res.json();
  const div = document.getElementById('txList');
  div.innerHTML = data.map(tx => `<div>${tx.category}: ₹${tx.amount} (${tx.type})</div>`).join('');
}

function loadDashboard() {
  document.getElementById('authSection').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  fetchTransactions();
}

if (token) loadDashboard();
