Financial Dashboard

A modern Finance Dashboard web application to track income, expenses, bills, and financial goals with Google authentication support.

Live Demo

Features

Track income and expenses in real-time

Add bills and receive reminders

Goals tracker and budget limits visualization

Smart alerts for overspending or upcoming bills

Google OAuth login for secure authentication

Export detailed transaction summaries in CSV format

Automated scheduled tasks with node-cron

Technologies Used

Backend: Node.js, Express

Frontend: EJS templating, Tailwind CSS

Database: MongoDB & Mongoose

Authentication: Passport.js (Local + Google OAuth 2.0)

Other Libraries:

bcryptjs (password hashing)

jsonwebtoken (JWT handling)

dotenv (environment variables)

csvtojson & json2csv (CSV export/import)

nodemailer (email notifications)

node-cron (scheduled tasks)

OpenAI & Google Generative AI APIs (optional features)

Installation

Clone the repository:

git clone https://github.com/Gyanendra876/Finance-Dashboard.git
cd Finance-Dashboard


Install dependencies:

npm install


Create a .env file in the project root and add the following environment variables:

PORT=3000
DB_URL=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_for_notifications
EMAIL_PASS=your_email_password


Start the server:

npm start


Open your browser at:

http://localhost:3000

Deployment

The project is deployed on Render
:

Live Demo: https://finance-dashboard-frontend-e8um.onrender.com

Render automatically pulls updates from GitHub for continuous deployment.

Make sure all .env variables are configured in Render’s Environment settings for production.

Usage

Register/login with your Google account or local credentials

Add income, expenses, and bills

Track goals and budget limits

Download transaction summaries in CSV format
Contributing

Fork the repository

Create a feature branch: git checkout -b feature-name

Commit your changes: git commit -m "Add feature"

Push to the branch: git push origin feature-name

Create a Pull Request

License

This project is licensed under the ISC License.

Author

Gyanendra Sinha

Email: harshsinha06x@gmail.com
