# ☕ CoffeeApp – Café Management System

**CoffeeApp** is a full-stack web application designed to simplify and digitalize café operations.  
It offers **two distinct dashboards** — one for **Admins** and one for **Waiters** — making it easy to manage menus, tables, and daily transactions in real time.

---

## 📖 Overview

CoffeeApp helps café managers and staff handle:
- Menu updates 🧾  
- Table reservations 🍽️  
- Waiter operations 👨‍🍳  
- Payment tracking 💰  
All within one simple, responsive interface.

---

## ✨ Features

### 👨‍💼 Admin Dashboard
- 🧾 **Menu Management**: Create, update, or delete food & drink items.  
- 🍽️ **Table Management**: Add, remove, or edit tables.  
- 👨‍🍳 **Waiter Management**: Add new staff, modify details, or remove inactive users.  
- 💹 **Sales Reports**: View daily or custom range-based reports.  
- 💰 **Remittance Tracking**: Monitor the total amount each waiter must remit per day.

### 👨‍🍳 Waiter Dashboard
- 👀 **View Tables**: Check table status (occupied / available).  
- 📝 **Take Orders**: Add menu items to orders directly from the interface.  
- 💵 **Mark Paid Orders**: Close a table when the customer has paid.  
- 📊 **Daily Summary**: Automatically calculate daily sales and remittances.

### 🌐 General Features
- 🔐 **Role-Based Login**: Secure authentication for Admin and Waiter accounts.  
- ⚡ **Real-Time Updates**: Orders and table status refresh instantly.  
- 📱 **Responsive Design**: Works smoothly on desktops and tablets.  
- ☕ **Coffee-Themed UI**: Warm, elegant, and user-friendly interface.

---

## 🛠️ Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React + Vite |
| **Backend** | PHP (REST API) |
| **Database** | MySQL |
| **Server** | XAMPP (Apache + PHP + MySQL) |
| **Styling** | CSS + Bootstrap (coffee-themed) |

---

## ⚙️ Setup & Installation

### 1. Clone the Repository
```
git clone https://github.com/yourusername/CoffeeApp.git
cd CoffeeApp
```
### 2. Setup the Backend (PHP + XAMPP)

Start Apache and MySQL from XAMPP.

Copy the backend folder into your htdocs directory:

```
cp -r backend /Applications/XAMPP/htdocs/CoffeeApp
```
### 3. Import the database:

Open http://localhost/phpmyadmin

Create a new database named coffee_db

Import the provided coffee_db.sql file

### 4.Run the Frontend (React)
```
cd frontend
npm install
npm run dev
```

---
### 🧠 How It Works

Login as Admin or Waiter

Depending on your role:

Admin: Manage café data (menu, staff, tables)

Waiter: Manage orders and payments

The frontend communicates with the PHP REST API via HTTP requests

All data is stored in MySQL, displayed dynamically in the UI

Admin can export or view sales analytics anytime

---

### 💡 Future Improvements

✅ Add role-based analytics dashboards

✅ Email or SMS notifications for remittances

🔜 Integrate with QR code table scanning

🔜 Add mobile (PWA) version for waiters

🔜 Implement token-based authentication (JWT)

---

### 🧑‍💻 Author

Zakaria sabiri

📍 Applied AI & Web Technologies
💬 “Building smart, human-centered café systems.”

📄 License
```
MIT License © 2025 Zakaria

```
