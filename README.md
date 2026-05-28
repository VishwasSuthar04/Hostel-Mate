# 🏠 HostelMate

### Smart Expense Management System for Hostel Students

HostelMate is a modern full-stack web application designed to help hostel students manage their daily expenses, monthly budgets, and shared group spending in a smarter and more organized way.

The platform combines **expense tracking**, **budget planning**, **group management**, and **AI-powered financial insights** into one seamless experience.

Built with a scalable monorepo architecture using **React**, **Node.js**, **MongoDB**, and a **Python AI microservice**.

---

# ✨ Features

## 🔐 Authentication & User Management

* Secure JWT-based authentication
* User registration & login system
* Password hashing with bcryptjs
* Editable user profile
* Avatar image upload support

---

## 💸 Expense Management

* Add, search, filter, and delete expenses
* 16 categorized expense types
* Monthly expense tracking
* Notes support for transactions
* Real-time budget warning alerts

---

## 📊 Interactive Dashboard

* Monthly spending statistics
* Category-wise expense breakdown
* Recent transaction history
* Dynamic spending charts
* Budget usage progress tracking

---

## 🧠 AI-Powered Financial Insights

* Smart expense analysis using Python & pandas
* Personalized spending recommendations
* Expense trend analysis
* Future spending prediction
* Intelligent category-based budgeting

---

## 💰 Budget Planning System

* Set monthly spending limits
* AI-generated budget allocation plans
* Editable category allocations
* Overspending notifications
* Remaining budget calculations

---

## 👥 Group Expense Management

* Create hostel expense groups
* Invite members via email
* Join groups using Group ID
* Shared expense tracking
* Group expense overview

---

## 📱 Fully Responsive UI

* Mobile-friendly design
* Sidebar navigation for desktop
* Bottom navigation for mobile
* Smooth animations & transitions
* Modern glassmorphism-inspired interface

---

# 🛠️ Tech Stack

| Category       | Technology                          |
| -------------- | ----------------------------------- |
| Frontend       | React 18, Vite 5, React Router 6    |
| Styling        | Tailwind CSS 3                      |
| Backend        | Node.js, Express.js                 |
| Database       | MongoDB, Mongoose                   |
| AI Service     | Python, Flask, pandas, scikit-learn |
| Authentication | JWT, bcryptjs                       |
| Charts         | Recharts                            |
| HTTP Client    | Axios                               |
| Notifications  | react-hot-toast                     |
| Icons          | lucide-react                        |

---

# 🏗️ System Architecture

```text id="v8y3kj"
┌────────────────┐
│  React Client  │
│    (Vite)      │
│     :5173      │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│  Express API   │
│    Node.js     │
│     :5000      │
└───────┬────────┘
        │
 ┌──────┴──────┐
 ▼             ▼
MongoDB     Flask AI Service
Database        :8000
```

---

# 📂 Project Structure

```text id="65smqo"
hostelmate-web/
├── client/            # React Frontend
├── server/            # Express Backend
├── ai-service/        # Flask AI Microservice
├── api/               # Vercel Serverless API
├── package.json
├── vercel.json
└── .env
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash id="fg4pxu"
git clone https://github.com/your-username/hostelmate.git
cd hostelmate
```

---

## 2️⃣ Install Dependencies

### Install Root Dependencies

```bash id="b7n2b7"
npm install
```

### Install Frontend Dependencies

```bash id="ef5k1m"
cd client
npm install
```

### Install Backend Dependencies

```bash id="yz6s7l"
cd ../server
npm install
```

### Install AI Service Dependencies

```bash id="v09f7f"
cd ../ai-service
pip install -r requirements.txt
```

---

# 🔑 Environment Variables

Create a `.env` file in the root directory and add:

```env id="lfu3cn"
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

PORT=5000
AI_SERVICE_URL=http://localhost:8000
```

---

# ▶️ Running the Project

## Start All Services

```bash id="dd4z8r"
npm run dev
```

This command starts:

* React Frontend
* Express Backend
* Flask AI Service

---

# 🌐 API Endpoints

## Authentication

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/api/auth/register` | Register user    |
| POST   | `/api/auth/login`    | Login user       |
| GET    | `/api/auth/me`       | Get current user |
| PUT    | `/api/auth/profile`  | Update profile   |

---

## Expenses

| Method | Endpoint              | Description        |
| ------ | --------------------- | ------------------ |
| GET    | `/api/expenses`       | Get expenses       |
| POST   | `/api/expenses`       | Add expense        |
| DELETE | `/api/expenses/:id`   | Delete expense     |
| GET    | `/api/expenses/stats` | Expense statistics |

---

## Budget

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| GET    | `/api/budget`               | Get budget              |
| PUT    | `/api/budget`               | Update budget           |
| POST   | `/api/budget/generate-plan` | Generate AI budget plan |

---

## AI Insights

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | `/api/ai/insights` | AI expense analysis |

---

# 🧠 AI Features

The AI microservice analyzes user spending behavior and provides:

* Expense trend analysis
* Smart financial recommendations
* Monthly spending predictions
* Category-based insights
* Intelligent budget allocation

Built using:

* Flask
* pandas
* scikit-learn

---

# 🎨 UI/UX Highlights

* Modern orange-themed interface
* Glassmorphism-inspired cards
* Urdu + English UI support
* Smooth animations & transitions
* Responsive layout for all devices
* Interactive charts & visualizations

---

# 📸 Screenshots

Add screenshots here for:

* Login Page
* Dashboard
* Expense Management
* Budget Planner
* AI Insights
* Mobile Responsive Design

---

# 🚀 Deployment

HostelMate is deployment-ready for:

* ▲ Vercel
* MongoDB Atlas
* Railway
* Render

---

# 📚 Learning Outcomes

This project helped strengthen my understanding of:

* Full-Stack Web Development
* REST API Design
* Authentication & Security
* Database Modeling
* AI Integration in Web Apps
* Responsive UI/UX Design
* State Management in React

---

# 👨‍💻 Author

## Vishwas Hirani

Computer Systems Engineering Student

---

# ⭐ Support

If you found this project helpful or interesting, consider giving it a ⭐ on GitHub.

---
