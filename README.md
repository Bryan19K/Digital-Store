# Digital Store - Setup Guide

This project is a MERN stack e-commerce application. Follow these instructions to set up the project on a new machine.

## Prerequisites
- Node.js (version 16 or higher)
- MongoDB Atlas account (or local MongoDB)

## 1. Clone the repository
```bash
git clone https://github.com/Bryan19K/Digital-Store.git
cd "Digital Store"
```

## 2. Server Setup (Backend)
Navigate to the server directory and install dependencies.
```bash
cd server
npm install
```

### Dependencies Installed:
- `express`: Web framework for Node.js.
- `mongoose`: MongoDB object modeling.
- `dotenv`: Manage environment variables.
- `cors`: Enable Cross-Origin Resource Sharing.
- `jsonwebtoken` & `bcryptjs`: For authentication and security.
- `nodemon` (dev): Automatic server restart on changes.

### Configure Environment Variables
Create a `.env` file in the `server` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

## 3. Frontend Setup
Navigate to the frontend directory and install dependencies.
```bash
cd ../frontend
npm install
```

### Dependencies Installed:
- `react`, `react-dom`: UI library.
- `vite`: Fast build tool and dev server.
- `axios`: For API requests to the backend.
- `zustand`: State management.
- `react-router-dom`: Navigation.
- `tailwindcss`, `postcss`, `autoprefixer`: Styling.
- `lucide-react`: Icon set.
- `react-i18next`: Multi-language support.

## 4. Running the Project
Open two terminals:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The shop should now be accessible at `http://localhost:5173`.
