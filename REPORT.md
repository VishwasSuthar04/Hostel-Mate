# HostelMate — Complete Project Report

> A full-stack hostel expense management app with AI-powered insights.
> Built as a monorepo with 3 services: React frontend, Express API, and Python AI microservice.

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite 5 + React Router 6 + Tailwind CSS 3 |
| **Backend** | Node.js + Express 4 + Mongoose 8 (MongoDB) |
| **AI Service** | Python 3 + Flask + scikit-learn + pandas |
| **Auth** | JWT + bcryptjs |
| **Charts** | Recharts (Pie, Line, Bar) |
| **Icons** | lucide-react |
| **Notifications** | react-hot-toast |
| **HTTP Client** | axios |

---

## 2. Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Vite Dev   │────▶│  Express API │────▶│   MongoDB (DB)  │
│  :5173      │     │  :5000       │     └─────────────────┘
│  React SPA  │     └──────┬───────┘
└─────────────┘            │ proxy
                           ▼
                    ┌─────────────────┐
                    │  Flask AI Svc   │
                    │  :8000          │
                    │  /analyze       │
                    │  /predict       │
                    └─────────────────┘
```

- **Monorepo**: `npm run dev` starts all 3 services concurrently
- **Vite proxy**: Client proxies `/api/*` -> backend on :5000
- **Vercel-ready**: `vercel.json` rewrites API -> serverless Express function

---

## 3. Project Structure

```
hostelmate-web/
├── .env                              # MongoDB URI, JWT secret, ports
├── package.json                      # Root monorepo orchestrator
├── vercel.json                       # Vercel deployment config
├── api/index.js                      # Vercel serverless entry
├── client/                           # React frontend (Vite)
│   ├── index.html                    # Entry HTML (fonts: Plus Jakarta Sans, Noto Nastaliq Urdu)
│   ├── vite.config.js                # Vite config with /api proxy
│   ├── tailwind.config.js            # Custom brand/surface colors, shadows, animations
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx                  # ReactDOM root + BrowserRouter
│       ├── App.jsx                   # Route definitions + providers
│       ├── index.css                 # Tailwind layers + custom classes
│       ├── pages/                    # 8 page components
│       ├── components/               # 3 shared components
│       ├── context/                  # 3 React Context providers
│       └── utils/                    # Axios instance + helpers
├── server/                           # Express backend
│   ├── index.js                      # Express app setup + MongoDB connection
│   ├── models/                       # 4 Mongoose schemas
│   ├── controllers/                  # 5 controllers
│   ├── routes/                       # 5 route files
│   ├── middlewares/                  # 1 auth middleware
│   └── uploads/                      # Avatar images
├── ai-service/                       # Python AI microservice
│   ├── app.py                        # Flask app (2 endpoints)
│   ├── models/spending_analyzer.py   # pandas-based analysis
│   └── requirements.txt
├── Hostel-Mate/                      # Stale submodule (ignore)
└── Hostelmate/                       # Stale submodule (ignore)
```

---

## 4. Pages & Features (8 Routes)

### Login (`/login`)
- Email + password form with show/hide toggle
- Urdu welcome: "HostelMate میں خوش آمدید"
- Gradient background with decorative grid overlay + animated orbs
- JWT stored in localStorage on success -> redirect to Dashboard
- Link to Register page

### Register (`/register`)
- Name, email, password, city (8 Pakistani cities dropdown)
- Urdu heading: "اکاؤنٹ بنائیں"
- Auto-login on successful registration
- Link to Login page

### Dashboard (`/dashboard`)
- Time-based greeting: Morning/Afternoon/Evening (with Urdu transliteration)
- 4 Stat Cards: This Month, Last Month, Total Spent, Number of Groups
- PieChart (Donut): Current month spending breakdown by category (color-coded)
- Recent Expenses: Last 5 items with category icon, description, date, amount (red)
- Budget Progress Card: Green/yellow/red bar showing monthly consumption
- "Add Expense" button -> navigates to `/expenses`

### Expenses (`/expenses`) — Full CRUD
- Search bar to filter expenses
- 16 category filter buttons with icons
- AddExpenseModal: Description, amount (PKR), date, 16-category grid, optional notes
- Budget alerts on creation (toast notifications: exceeded/warning)
- Expense list: category icon, description, date badge, amount, hover delete
- Loading skeletons during data fetch
- Empty states with contextual CTAs

### Budget (`/budget`)
- Monthly Budget card: Input + Save for total spending limit
- This Month Overview: 3-column grid (Budget / Spent / Remaining) with gradient backgrounds
- Overspent warning with red alert and triangle icon
- AI Plan Generator: "Generate" button -> backend distributes budget across categories using historical ratios (or defaults)
- Editable Plan: Each category shows allocated vs spent with color-coded progress bars (green/yellow/red)
- Inline editing: Click input fields to adjust allocations, then Save
- Empty state prompting user to set budget first

### Groups (`/groups`)
- Group Cards: Purple gradient icon, name, description, member count badge, total expenses
- Create Group Modal: Name + description -> auto-join creator
- Join Group Modal: Paste group ID
- Group Detail Modal: Members list with avatars (initials), admin badge, copy ID button, leave button
- Invite Modal: Find user by email -> add to group

### Insights (`/insights`)
- LineChart: 12-month spending trend (orange stroke)
- BarChart: Category breakdown with color-coded bars
- AI-Powered Analysis: "Analyze" button -> Flask `/analyze` endpoint
- AI returns: insight cards (yellow alerts) + recommendation cards (green checkmarks)
- Fallback: If AI service is down, server returns basic insights
- Urdu labels: "AI سے تجزیہ" / "AI سے سمارٹ مشورے"
- Loading spinner during analysis

### Profile (`/profile`)
- Avatar: Gradient initial placeholder OR uploaded image
- Avatar upload: Camera button -> file picker (images only, max 5MB)
- Edit name + city dropdown (email is read-only)
- Account info card: Member since date, PKR currency with flag
- Urdu label: "پروفائل"

---

## 5. API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create user, return JWT |
| POST | `/api/auth/login` | No | Authenticate, return JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| PUT | `/api/auth/profile` | Yes | Update name/city |
| POST | `/api/auth/avatar` | Yes | Upload avatar image (multipart) |

### Expenses
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/expenses` | Yes | List expenses (query: limit, category, search) |
| POST | `/api/expenses` | Yes | Create expense (with budget alert logic) |
| DELETE | `/api/expenses/:id` | Yes | Delete own expense |
| GET | `/api/expenses/stats` | Yes | Aggregated totals, this/last month, by-category |
| GET | `/api/expenses/monthly` | Yes | Monthly aggregation for 12 months |

### Budget
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/budget` | Yes | Current month budget + plan with spent |
| PUT | `/api/budget` | Yes | Set monthly budget |
| POST | `/api/budget/generate-plan` | Yes | Auto-allocate budget by category |
| PUT | `/api/budget/plan` | Yes | Manual plan adjustment |

### Groups
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/groups` | Yes | User's groups |
| GET | `/api/groups/:id` | Yes | Single group detail |
| POST | `/api/groups` | Yes | Create group, auto-join creator |
| POST | `/api/groups/join` | Yes | Join by group ID |
| POST | `/api/groups/:id/invite` | Yes | Add member by email |
| POST | `/api/groups/:id/leave` | Yes | Remove self from group |

### AI
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/ai/insights` | Yes | Get AI analysis (proxies Flask) |

### System
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Health check |

---

## 6. Database Models (MongoDB/Mongoose)

### User
- `name` (String, required)
- `email` (String, required, unique, lowercase)
- `password` (String, required, min 6, hashed via bcryptjs, excluded from JSON)
- `city` (String, default '')
- `avatar` (String, default '', URL path to uploaded image)
- `currency` (String, default 'PKR')
- Timestamps: true

### Expense
- `user` (ObjectId ref 'User', required)
- `group` (ObjectId ref 'Group', optional)
- `description` (String, required)
- `amount` (Number, required, min 0)
- `category` (String, enum of 16 categories, default 'other')
- `date` (Date, default now)
- `notes` (String, default '')
- `isShared` (Boolean, default false)
- `splitWith` ([ObjectId ref 'User'])
- Timestamps: true

### Budget
- `user` (ObjectId ref 'User', required)
- `month` (String, required, format "YYYY-MM")
- `monthlyBudget` (Number, default 0)
- `plan` ([{ category: String, allocated: Number }])
- Timestamps: true
- Compound unique index: { user, month }

### Group
- `name` (String, required)
- `description` (String, default '')
- `createdBy` (ObjectId ref 'User', required)
- `members` ([ObjectId ref 'User'])
- `totalExpenses` (Number, default 0)
- Timestamps: true

---

## 7. Key Features to Showcase in Video

### Budget Alert System
When an expense is created, the server checks:
1. Total spent > monthly budget -> `budget_exceeded` alert
2. Category spent > plan allocation -> `category_exceeded` alert
3. Total spent > 80% of budget -> `budget_warning` alert
All alerts shown as toast notifications on the client.

### AI Plan Generation
- Analyzes last 3 months of expenses per category
- Calculates ratio of each category to total spending
- Applies ratio to monthly budget
- Falls back to defaults (food 30%, rent 25%, utilities 10%, etc.) if no history

### AI Insights (Flask)
- `POST /analyze`: Receives { expenses } -> pandas analysis
- Generates 2-4 insights (total spent, top category %, weekly trend)
- Generates 3-4 recommendations (food costs, transport, budget allocation)
- Summary statistics returned alongside
- `POST /predict`: Predicts next month spending (daily average * 30)
- Confidence levels: high (>30 txns), medium (15-30), low (<10)

### Responsive Design
- Desktop: Sidebar navigation (64px wide)
- Mobile: Hamburger menu + slide-out drawer + bottom nav bar (5 items)
- Cards use `grid-cols-2 md:grid-cols-4` for responsive layouts
- Modals: Bottom sheet on mobile, centered on desktop

---

## 8. UI/UX Details

### Custom Tailwind Theme
- Brand orange palette (#f97316 primary) + surface slate palette
- Fonts: Plus Jakarta Sans (English), Noto Nastaliq Urdu (Urdu)
- Custom shadows: soft, card, elevated, modal
- Custom animations: fade-in, slide-up, slide-down, scale-in, pulse-slow

### Custom CSS Classes (index.css)
- `.btn-primary` — Orange gradient button with scale press effect
- `.btn-secondary` — White outlined button
- `.btn-ghost` — Minimal text button
- `.card` / `.card-hover` / `.card-glass` — White/glassmorphic cards
- `.input` / `.input-error` — Form inputs with focus ring
- `.badge-*` — 5 color variants (green, red, orange, blue, purple)
- `.skeleton` — Shimmer loading placeholder
- `.modal-overlay` / `.modal-content` — Backdrop + centered modal
- `.stat-card` — Dashboard stat cards
- `.scrollbar-thin` — Custom thin scrollbar
- `.text-gradient` — Orange gradient text
- `.bg-grid` — Subtle dot grid pattern

### State Management
- AuthContext: user, login, register, logout, fetchMe
- ExpenseContext: expenses, stats, CRUD operations
- BudgetContext: budget, plan, generate, update

### Currency
All amounts formatted via `Intl.NumberFormat('en-PK')` with `style: 'currency', currency: 'PKR'`

---

## 9. Suggested Video Script Outline

### Scene 1: Introduction (30s)
- Show landing on Login page with gradient background
- Explain: "HostelMate — the all-in-one expense tracker for hostel students"

### Scene 2: Registration & Onboarding (30s)
- Register flow: fill form, select city, submit
- Land on Dashboard

### Scene 3: Dashboard Overview (45s)
- Stat cards, PieChart, recent expenses, budget card
- Explain: "Everything at a glance"

### Scene 4: Adding Expenses (45s)
- Navigate to Expenses page
- Add an expense with category selection
- Show budget toast alert

### Scene 5: Budget Management (45s)
- Budget page: set monthly limit
- Generate AI plan
- Edit allocations inline

### Scene 6: Groups (30s)
- Create a group
- Invite a member

### Scene 7: AI Insights (30s)
- Run AI analysis
- Show insight cards + recommendation cards
- Monthly trend chart

### Scene 8: Profile & Settings (20s)
- Upload avatar
- Edit profile

### Scene 9: Mobile Responsive (20s)
- Toggle hamburger menu
- Show bottom nav bar

### Scene 10: Outro (15s)
- "HostelMate — Smart budgeting for students"

---

## 10. Notable Notes

- **Partial Urdu localization**: Every page has Urdu text inline (hardcoded, not i18n)
- **No TypeScript**: Entirely JavaScript/JSX
- **No tests**: No testing framework found
- **No Docker**: Not containerized
- **Multer**: Handles avatar uploads (5MB limit, images only)
- **bcryptjs**: Password hashing with 12 rounds
- **JWT**: 7-day expiry
- **Known bug**: `client/src/utils/api.js` creates 2 axios instances — one unused (dead code line 3-4)
- **Stale submodules**: `Hostel-Mate/` and `Hostelmate/` are empty git submodules
