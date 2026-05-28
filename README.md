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
  <img width="1912" height="882" alt="image" src="https://github.com/user-attachments/assets/e6fcb04e-02be-4208-b35e-3665535c01a9" />

* Dashboard
  <img width="1913" height="882" alt="image" src="https://github.com/user-attachments/assets/34f702f8-b01b-488c-b1d2-c7d73e8ea327" />

* Expense Management
  <img width="1920" height="876" alt="image" src="https://github.com/user-attachments/assets/c2aeff6e-bac9-47b7-b9db-d3bdb4987f9d" />

* Budget Planner
  <img width="1920" height="886" alt="image" src="https://github.com/user-attachments/assets/0637ba80-2c0b-4844-833c-92c58e3f5f9a" />

* AI Insights
  <img width="1915" height="881" alt="image" src="https://github.com/user-attachments/assets/7e681785-1f28-4cae-88a3-5a81c45ad724" />

* Mobile Responsive Design
<img width="357" height="768" alt="image" src="https://github.com/user-attachments/assets/3ff7a9f8-68e8-40db-9e86-c5e4b19dc55a" />
<img width="358" height="773" alt="image" src="https://github.com/user-attachments/assets/31e6f50a-0767-4f93-8d02-ef055e7dbf28" />
<img width="357" height="775" alt="image" src="https://github.com/user-attachments/assets/02c27079-393b-402a-b434-7d58cd948da8" />
<img width="363" height="773" alt="image" src="https://github.com/user-attachments/assets/695b5fb4-1de1-4a6c-b4b5-ae932582b935" />

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
