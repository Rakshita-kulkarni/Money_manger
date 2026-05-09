# MoneyMgr — Personal Finance Tracker

A full-stack personal money management app built with **React + Vite + TailwindCSS** (frontend) and **Node.js + Express + MongoDB** (backend).

## Features

- **Authentication** — JWT-based signup/login with 30-day session
- **Expense Tracking** — Log expenses by category/type and description, linked to a payment account
- **Budget** — Set and track a monthly spending budget
- **Transactions** — Track money lent/borrowed with reason and settlement status
- **Payment Accounts** — Manage Cash, UPI, and Card accounts with live balance tracking
- **Custom Categories** — Create, edit and delete your own expense categories (seeded with 8 defaults)
- **Income** — Record income per account; account balance auto-updates
- **Dark / Light / System Theme** — Three-way theme toggle persisted in localStorage

---

## Tech Stack

| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Frontend  | React 18, Vite 5, TailwindCSS 3, React Router 6, Axios |
| Backend   | Node.js, Express 5, Mongoose 9, MongoDB Atlas |
| Auth      | bcryptjs, JSON Web Token                      |
| Dev tools | Nodemon, ESLint                               |

---

## Project Structure

```
web_money/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # AuthContext, ThemeContext
│   │   ├── hooks/        # Custom data hooks
│   │   ├── layouts/      # DashboardLayout
│   │   ├── pages/        # Route-level page components
│   │   └── services/     # Axios API service layer
│   └── ...
└── server/          # Express + MongoDB backend
    ├── config/       # DB connection
    ├── controllers/  # Route handler logic
    ├── middleware/   # JWT auth middleware
    ├── models/       # Mongoose schemas
    ├── routes/       # Express routers
    └── sever.js      # Entry point
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/web_money.git
cd web_money
```

### 2. Configure environment variables

```bash
cp server/.env.example server/.env
```

Open `server/.env` and fill in your values:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Cluster0
JWT_SECRET=replace_with_a_long_random_secret
```

### 3. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 4. Run in development

Open **two terminals**:

```bash
# Terminal 1 — backend (from /server)
npm run dev

# Terminal 2 — frontend (from /client)
npm run dev
```

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000` (proxies `/api` → port 5000)

### 5. Build for production

```bash
cd client
npm run build
```

Static files are output to `client/dist/`.

---

## API Endpoints

All routes except `/api/auth/*` require the `Authorization: Bearer <token>` header.

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET/POST/DELETE | `/api/expenses` | Manage expenses |
| GET/POST | `/api/budget` | Get/set monthly budget |
| GET/POST/PUT/DELETE | `/api/transactions` | Manage lent/borrowed |
| GET/POST/PUT/DELETE | `/api/accounts` | Manage payment accounts |
| GET/POST/PUT/DELETE | `/api/categories` | Manage expense categories |
| GET/POST/DELETE | `/api/income` | Record and delete income |

---

## Environment Variables

See [`server/.env.example`](server/.env.example) for the full list.

| Variable | Description |
|----------|-------------|
| `PORT` | Port for the Express server (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWTs — use a long random string |

---

## Notes

- The server entry file is named `sever.js` (intentional, do not rename without updating `package.json`)
- Mongoose 9.x is used — pre-save hooks use pure `async/await` without a `next` callback
- If your router's DNS does not support SRV records, `config/db.js` overrides DNS servers to `8.8.8.8` / `8.8.4.4` automatically

---

