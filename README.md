# NMNORA – Modern E-Commerce Application

> A complete full-stack e-commerce web application built with React.js, Vite, Tailwind CSS, Node.js, and Express.js. No database required — data is persisted via JSON files and browser LocalStorage.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite + Tailwind CSS v3 |
| Routing | React Router DOM v6 |
| Icons | Lucide React |
| HTTP Client | Axios |
| Backend | Node.js + Express.js |
| Data Storage | JSON files (`server/data/`) |
| Cart Persistence | Browser LocalStorage |

---

## 🚀 Quick Start

### 1. Install all dependencies
```bash
npm run install-all
```

### 2. Start frontend + backend together (single command)
```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

## 📁 Project Structure

```
NMNORA/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderSuccessPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Node.js + Express backend
│   ├── routes/
│   │   ├── products.js
│   │   └── orders.js
│   ├── data/
│   │   ├── products.json       # 14 seeded products
│   │   └── orders.json         # Order storage
│   └── server.js
│
└── package.json                # Root scripts with concurrently
```

---

## 🌟 Features

### Customer Features
- **Homepage** – Hero banner, category cards, featured & bestseller products, promo banner
- **Shop Page** – All products with category filter, search, and price sort
- **Product Detail** – Images, description, quantity selector, add to cart, related products
- **Shopping Cart** – Add/remove/update items, delivery fee calc, localStorage persistence
- **Checkout** – Form with validation, order summary, demo order placement
- **Order Success** – Order ID, items summary, delivery estimate

### Admin Features
- **Dashboard** – Total products, orders, revenue stats
- **Product CRUD** – Add, edit, delete products via modal forms
- **Order Management** – View all orders, update order status

---

## 🔌 REST API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get single order |
| POST | `/api/orders` | Place new order |
| PATCH | `/api/orders/:id/status` | Update order status |

---

## ⚠️ Project Limitations

- **JSON files** replace a real database — suitable for demos, not concurrent production traffic
- **Admin panel** has no authentication — demo use only
- **Checkout** does not process real payments
- Cart data lives in browser `localStorage` per device

---

## 📋 Internship Project Notes

This project demonstrates:
- Full-stack JavaScript development (React + Node.js)
- RESTful API design and implementation
- State management with React Context + useReducer
- Client-side routing with React Router
- Responsive UI design with Tailwind CSS
- JSON file-based data persistence
- Shopping cart with localStorage
- Form validation and user feedback

---

*Built as a college full-stack web development internship project using Google Antigravity.*
