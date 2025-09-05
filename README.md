# 💰 SmartFinance

A **full-stack expense management application** with a **React + Vite frontend** and a **FastAPI backend**.

---

## 📂 Project Structure

### 🔹 Frontend
Built with **React, Vite, and Tailwind CSS**.

**Main directories:**
- **`components/`** → Reusable UI components  
- **`pages/`** → Application pages (Dashboard, Login, Register, etc.)  
- **`hooks/`** → Custom React hooks  
- **`utils/`** → Utility functions and helpers  

**Features:**
- Authentication flow (login & register)  
- Dashboard with expense overview  
- Expense CRUD management  
- Insights & analytics  
- Receipt upload UI  

---

### 🔹 Backend
Powered by **FastAPI**.

**Key components:**
- Modular routers and services  
- MongoDB for persistent data storage  
- JWT-based authentication  
- OCR service placeholder for receipt processing  

---

## 🚀 Getting Started

### ✅ Prerequisites
- [Node.js](https://nodejs.org/) & npm (for frontend)  
- [Python 3.8+](https://www.python.org/) (for backend)  
- [MongoDB](https://www.mongodb.com/) (local or cloud)  

---

### ⚙️ Setup

#### 🔹 Frontend
```bash
cd frontend
npm install
npm run dev

#### 🔹Backend 🔹 
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload