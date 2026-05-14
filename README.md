 Finance Dashboard (Full Stack)

A full-stack personal finance dashboard that helps users track transactions, analyze reports, and manage a mutual fund portfolio with real-time insights.

Built using React, Node.js, Express, and MongoDB.

🚀 Features
🔐 Authentication

User registration & login

JWT-based authentication

Protected routes

📊 Dashboard

Overview of total investment

Profit / loss summary

Portfolio performance snapshot

🧾 Transactions

Add income and expense transactions

Categorize transactions

View transaction history

📈 Reports

Date-wise financial reports

Investment performance analysis

Profit & loss calculations

Charts and visual insights

💼 My Portfolio (Mutual Funds)

Add mutual fund investments

View different mutual funds

Track units, invested amount & current value

Portfolio-level profit / loss

Scheme-wise performance

🌐 Live Demo (Deployed on Render)

👉 Frontend:

https://finance-dashboard-frontend-e8um.onrender.com


👉 Backend API:

https://finance-dashboard-3juc.onrender.com


⚠️ Note: The app may take a few seconds to load initially because Render free instances spin down when idle.


🛠️ Tech Stack
Frontend

React

React Router

Chart.js

Tailwind CSS / CSS

Fetch API

Backend

Node.js

Express.js

JWT Authentication

REST APIs

Database

MongoDB

Mongoose

📁 Project Structure
finance-dashboard/
│
├── frontend/
├── backend/
├── screenshots/
│   ├── login.png
│   ├── dashboard.png
│   ├── add-transaction.png
│   ├── reports.png
│   └── portfolio.png
│
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/finance-dashboard.git
cd finance-dashboard

2️⃣ Backend Setup
cd backend
npm install


Create .env file:

PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Run backend:

npm start

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🚧 Future Improvements

Live NAV integration for mutual funds

Export reports as PDF/Excel

Advanced analytics & filters

Mobile responsiveness

Dark mode

👨‍💻 Author

Gyanendra Sinha
Full Stack Developer

⭐ Support

If you like this project, please give it a ⭐ on GitHub!
