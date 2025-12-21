# E-commerce Monolithic TypeScript API

A Node.js Express TypeScript practice project for building an e-commerce API with user authentication, product management, and order processing.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file in the root directory:

```env
PORT=8000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key
JWT_EXPIRES=1d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin User
```

## Database Setup

1. Generate migrations:
```bash
npm run db:generate
```

2. Run migrations:
```bash
npm run db:migrate
```

3. Initialize admin user:
```bash
npm run db:init
```

## Running the Project

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

## API Endpoints

### Public Routes
- `POST /api/v1/users` - Register user
- `POST /api/v1/users/login` - Login user
- `GET /api/v1/products` - Get all products (with pagination)

### Protected Routes (Requires JWT)
- `GET /api/v1/users/profile` - Get user profile
- `GET /api/v1/orders` - Get user orders
- `POST /api/v1/orders` - Create order

### Admin Routes (Requires Admin Role)
- `GET /api/admin/users` - Get all users
- `POST /api/admin/products` - Create product(s)

## Tech Stack

- Express.js
- TypeScript
- Drizzle ORM
- PostgreSQL
- Zod (Validation)
- JWT (Authentication)
- bcrypt (Password Hashing)
- Helmet, CORS, express-rate-limit (Security)

