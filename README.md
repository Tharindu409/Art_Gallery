# Art Gallery

A full-stack web application for managing and showcasing an online art gallery experience, including artwork browsing, exhibitions, bidding, user/admin operations, and order handling.

## 📌 Overview

This project is organized as a **monorepo** with:

- **Frontend**: React + Vite application (`/frontend`)
- **Backend**: Node.js + Express + MongoDB API (`/backend`)

The backend exposes REST APIs for users, admins, artworks, exhibitions, bidding, and orders, while the frontend provides the user interface.

## 🧰 Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- jsPDF / jsPDF-AutoTable
- Supabase JS client

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Joi validation
- Bcrypt
- Multer
- Nodemailer
- PDFKit
- Morgan
- CORS

## 📁 Project Structure

```text
Art_Gallery/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
└── README.md
```

## ⚙️ Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm**
- **MongoDB connection string** (Atlas or local)

## 🚀 Getting Started

### 1) Clone the repository

```bash
git clone https://github.com/Tharindu409/Art_Gallery.git
cd Art_Gallery
```

### 2) Setup backend

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run backend in development mode:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

### 3) Setup frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend (Vite) runs at: `http://localhost:5173`

## 🧪 Available Scripts

### Frontend (`/frontend`)

- `npm run dev` – start development server
- `npm run build` – production build
- `npm run preview` – preview production build
- `npm run lint` – run ESLint

### Backend (`/backend`)

- `npm run dev` – start server with nodemon
- `npm start` – start server with node

## 🔌 API Base Routes

From `backend/server.js`:

- `/api/users`
- `/api/admin`
- `/api/arts`
- `/api/exhibitions`
- `/api/bidding`
- `/api/orders`

## 🔐 Environment & Security Notes

- Store sensitive values in `.env` (never commit secrets).
- It is recommended to rotate any exposed DB credentials and use environment variables only.
- Set proper CORS origins for production.

 
 
