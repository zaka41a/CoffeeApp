<p align="center">
  <img src="frontend/src/assets/logo.svg" alt="CoffeeApp logo" width="120">
</p>
<p align="center"><em>Full-stack café management platform that keeps baristas, waiters, and managers in sync.</em></p>

---

## 📚 Table of contents
- [Overview](#-overview)
- [Feature highlights](#-feature-highlights)
- [System architecture](#-system-architecture)
- [Tech stack](#-tech-stack)
- [Project structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Backend setup](#️-backend-setup)
- [Database setup](#️-database-setup)
- [Frontend setup](#-frontend-setup)
- [Configuration notes](#️-configuration-notes)
- [Running the app](#-running-the-app)
- [API quick reference](#-api-quick-reference)
- [Data model outline](#-data-model-outline)
- [Assets and uploads](#️-assets-and-uploads)
- [Default credentials](#-default-credentials)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview
CoffeeApp delivers an end-to-end workflow for cafés. Admins curate menus, onboard staff, and monitor revenue in real time, while waiters keep floor status and orders up to date from a tablet-friendly interface. Role-aware authentication ensures each profile only sees the tools they need.

## ✨ Feature highlights
**🧑‍💼 Admin console**
- 📊 Revenue dashboard summarising totals by waiter and day.
- 🛠️ Menu builder with pricing, descriptions, and imagery support.
- 🪑 Table manager to add, edit, or retire dining tables and track occupancy.
- 📇 Waiter directory with secure credential provisioning and edits.

**🧑‍🍳 Waiter console**
- 🗺️ Floor overview showing free, occupied, and pending tables.
- 🧾 Guided order capture with automatic totals and per-item pricing.
- ✅ One-tap settlement for paid or voided tickets, freeing tables instantly.
- 💼 Personal daily summary of orders and expected remittance.

**🌐 Shared platform**
- 🔐 Session-backed authentication with granular admin/waiter roles.
- 📱 Responsive React UI optimised for desktop and tablet breakpoints.
- 🔁 REST API returning JSON for all read/write operations.
- 🖼️ Image uploads for menu items stored behind PHP-managed directories.

## 🏗️ System architecture
```
Vite + React SPA ──▶ Axios ──▶ PHP REST API ──▶ MySQL (coffeeapp)
                          ▲           │
                          └─ Sessions + role guards
```
- Frontend: single-page application compiled by Vite.
- Backend: lightweight PHP API in `backend/api` with PDO access.
- Sessions: PHP native sessions keep users logged in and enforce roles.
- Data: relational schema stored in MySQL (default database `coffeeapp`).

## 🛠️ Tech stack
| Layer | Tooling |
| --- | --- |
| Frontend | React 18, Vite 5, Tailwind CSS, Framer Motion, React Router |
| Backend | PHP 8+, PDO, custom routing, session auth |
| Data | MySQL 8 (configurable), InnoDB tables |
| Tooling | npm, TypeScript (frontend), XAMPP / Apache + PHP |

## 📂 Project structure
```
CoffeeApp/
├── backend/
│   ├── api/
│   │   ├── auth/              # login/logout/me endpoints
│   │   ├── admin/             # privileged menu utilities
│   │   ├── categories.php     # public category list
│   │   ├── menu.php           # menu CRUD (admin)
│   │   ├── orders.php         # waiter/admin order flows
│   │   ├── tables.php         # dining table CRUD
│   │   ├── waiters.php        # waiter management
│   │   ├── auth_mw.php        # CORS + session middleware
│   │   ├── config.php         # session + CORS bootstrap
│   │   └── db.php             # PDO connection helper
│   ├── seed_admin.php         # CLI seeder for default admin
│   └── uploads/               # runtime image uploads
├── frontend/
│   ├── src/                   # React screens & UI primitives
│   ├── tailwind.config.js
│   └── vite.config.js
├── node_modules/              # workspace dependencies (if installed)
├── package.json               # root npm metadata (React + Vite)
└── README.md
```

## ✅ Prerequisites
- Node.js 18+ (npm 10 recommended).
- PHP 8.1+ with PDO MySQL extension enabled.
- MySQL 8 (or compatible) server.
- XAMPP, MAMP, or another Apache+PHP stack with write access to `htdocs`.

## 🖥️ Backend setup
1. Place the project inside your web root (e.g. `/Applications/XAMPP/xamppfiles/htdocs/CoffeeApp`).
2. Update `backend/api/db.php` with your database credentials.
3. Configure CORS origins in:
   - `backend/api/config.php` (default `http://localhost:5173`).
   - `backend/api/auth_mw.php` allow-list (add any extra dev URLs).
4. Ensure PHP can write to `backend/uploads/` and subdirectories (`chmod 775` on Unix-like systems).
5. Restart Apache through XAMPP so configuration changes are applied.

## 🗄️ Database setup
1. Create a database named `coffeeapp` (or update `db.php` to match your own name).
2. Import the schema covering users, roles, categories, menu items, dining tables, orders, order_items, remittances.
3. Seed the default administrator:
   ```bash
   php backend/seed_admin.php
   ```
   This script provisions `admin@coffeapp.local` / `admin123` and is safe to run multiple times.
4. Optionally insert sample menu items and tables via phpMyAdmin or the admin UI after logging in.

## 🎨 Frontend setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. API endpoints are derived from `window.location` via `src/_api.js`. If you deploy under a different folder name, adjust `APP_DIR` there.
3. Tailwind CSS is configured via `postcss.config.js` and `tailwind.config.js`; tweak theme tokens as needed.

## ⚙️ Configuration notes
- Axios/fetch requests include credentials; keep `Access-Control-Allow-Credentials` enabled in PHP headers.
- When serving the frontend from another host/port, mirror that origin in both `config.php` and `auth_mw.php`.
- Consider promoting secrets (DB credentials, session options) to environment variables for production deployments.
- Uploaded menu images land in `backend/uploads/foods/`; include this directory in backups.

## 🚀 Running the app
- **Frontend (development)** ✨
  ```bash
  npm run dev
  ```
  The dev server listens on `http://localhost:5173` by default.

- **Frontend (production build)** 🏁
  ```bash
  npm run build
  npm run preview   # optional local preview on port 4173
  ```

- **Backend** 🔙
  The PHP API runs via Apache. Visit `http://localhost/CoffeeApp/backend/api/` or use the login page to confirm it is responding.

## 🔌 API quick reference
| Endpoint | Methods | Description | Access |
| --- | --- | --- | --- |
| `/backend/api/auth/login.php` | POST | Authenticate admin or waiter (email/password). | Public |
| `/backend/api/auth/logout.php` | POST | Destroy the current session. | Authenticated |
| `/backend/api/auth/me.php` | GET | Return the current session profile. | Authenticated |
| `/backend/api/categories.php` | GET | List menu categories. | Authenticated |
| `/backend/api/menu.php` | GET, POST, PUT, DELETE | Manage menu items and optional images. | Admin (writes) |
| `/backend/api/tables.php` | GET, POST, PATCH, DELETE | Manage dining tables and statuses. | Admin (writes) |
| `/backend/api/orders.php?scope=open_tables` | GET | Tables with open checks. | Waiter/Admin |
| `/backend/api/orders.php?scope=today_waiter` | GET | Daily orders for the logged-in waiter. | Waiter/Admin |
| `/backend/api/orders.php?scope=totals_by_waiter` | GET | Revenue grouped by waiter/day. | Admin |
| `/backend/api/orders.php` | POST | Create a new order with line items. | Waiter/Admin |
| `/backend/api/orders.php?id={id}` | PATCH | Close an order as `paid` or `void`. | Waiter/Admin |
| `/backend/api/waiters.php` | GET, POST, PUT, DELETE | CRUD for waiter accounts. | Admin |

All endpoints exchange JSON; image uploads accept `multipart/form-data`.

## 🧱 Data model outline
| Table | Purpose | Notable columns |
| --- | --- | --- |
| `roles` | Role catalogue (`admin`, `waiter`). | `code`, `label` |
| `users` | Staff accounts. | `role_id`, `full_name`, `email`, `password_hash`, `created_at` |
| `categories` | Menu groupings. | `name`, `display_order` |
| `menu_items` | Food and drink catalogue. | `category_id`, `name`, `description`, `price`, `image_path`, `is_active` |
| `dining_tables` | Physical tables and occupancy. | `number`, `seats`, `status` |
| `orders` | Order header. | `table_id`, `user_id`, `status`, `total`, `created_at`, `closed_at` |
| `order_items` | Line items per order. | `order_id`, `menu_item_id`, `quantity`, `unit_price` |
| `remittances` | Waiter settlement tracking. | `waiter_id`, `order_id`, `amount`, `settled_at` |

## 🖼️ Assets and uploads
- Menu imagery is stored under `backend/uploads/foods/`.
- Static frontend assets reside in `frontend/src/assets/`.
- Configure Apache to expose `/CoffeeApp/backend/uploads/` while preventing directory listing in production.

## 🔐 Default credentials
- Seeder account: `admin@coffeapp.local` / `admin123` (created by `php backend/seed_admin.php`).
- Create waiter accounts through the admin interface after logging in.

## 🩺 Troubleshooting
- ⚠️ **Frontend cannot reach API:** confirm `APP_DIR` in `frontend/src/_api.js` matches the folder under `htdocs` and that Apache is running.
- 🌐 **CORS errors:** add your frontend origin to both `config.php` and `auth_mw.php`, then restart Apache.
- 🔁 **Login loops:** ensure PHP session storage is writable (`xamppfiles/temp` on macOS installations).
- 🗄️ **Database errors:** verify credentials in `db.php` and test with `mysql -u root -p`.
- 📸 **Image upload failures:** check folder permissions and allowed extensions (`jpg`, `jpeg`, `png`, `webp`, `gif`).

## 🤝 Contributing
1. Fork the repository and create feature branches.
2. Follow PSR-12 for PHP and run `npm run build` before opening a PR.
3. Include screenshots or recordings for UI changes.

## 📜 License
No explicit license is provided. Add one before redistributing or deploying to production.
