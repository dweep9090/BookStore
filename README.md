# AI Powered BookStore

A full-stack e-commerce bookstore platform built with React, Node.js, PostgreSQL, Redis, and Google Gemini AI.

The application allows users to browse books, manage carts and wishlists, place orders, review books, and receive AI-powered summaries and recommendations. It also includes an admin dashboard for inventory and order management.

---

## Features

### User Features

* User Registration & Login
* JWT Authentication
* Refresh Token Authentication
* Browse Books
* Search Books
* Pagination
* Wishlist Management
* Shopping Cart
* Order Placement
* Order History
* Reviews & Ratings
* AI Book Summaries
* AI Book Recommendations
* Dark / Light Theme

### Admin Features

* Admin Dashboard
* Book Management
* Inventory Management
* Stock Logs
* Order Management
* Order Status Updates
* Revenue Analytics
* Top Rated Books Dashboard

### Security & Performance

* Helmet Security Headers
* Rate Limiting
* Redis Caching
* Role-Based Access Control (RBAC)
* Password Hashing using bcrypt

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* React Hook Form
* Zod

### Backend

* Node.js
* Express
* TypeScript
* Prisma ORM

### Database

* PostgreSQL (Neon)

### Caching

* Redis (Upstash)

### AI

* Google Gemini API

---

## Project Structure

BookStore/

├── backend/

├── frontend/

└── README.md

---

## Environment Variables

### Backend (.env)

Create a file named `.env` inside the backend folder.

```env
PORT=8000

DATABASE_URL=

JWT_SECRET=

GEMINI_API_KEY=

UPSTASH_REDIS_REST_URL=

UPSTASH_REDIS_REST_TOKEN=
```

### Frontend (.env)

Create a file named `.env` inside the frontend folder.

```env
VITE_API_URL=http://localhost:8000/api
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/dweep9090/BookStore.git
```

Move into the project:

```bash
cd BookStore
```

---

## Backend Setup

Move to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate deploy
```

Start development server:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:8000
```

---

## Frontend Setup

Move to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## AI Features

### AI Summary Generation

Generates concise summaries for books using Google Gemini.

### AI Recommendations

Suggests similar books based on:

* Title
* Author
* Genre
* Description

Recommendations are cached using Redis to reduce API calls and improve response time.

---

## Security Features

* JWT Access Tokens
* Refresh Tokens
* Helmet
* Rate Limiting
* Role-Based Authorization
* Environment Variable Protection

---

## Performance Optimizations

* Redis Caching
* Pagination
* Database Query Optimization

---

## Future Enhancements

* Razorpay Integration
* Email Notifications
* Docker Deployment
* CI/CD Pipeline
* Advanced Recommendation Engine

---

## Author

Dweep Kotecha

B.Tech Mathematics & Computing

DAIICT
