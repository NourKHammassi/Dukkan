# Dukkan — Multi-Vendor Marketplace

Full-stack multi-vendor e-commerce platform. Browse products across multiple stores, manage a persistent cart, place orders with shipping, and track your order history.

## Tech Stack

**Backend**
- .NET 10 — Clean Architecture (Domain, Application, Infrastructure, API)
- PostgreSQL + Entity Framework Core
- JWT Authentication (Bearer tokens)
- REST API with Swagger / OpenAPI

**Frontend**
- React 19 + TypeScript + Vite
- Zustand — cart & auth state with localStorage persistence
- React Router DOM v7
- Axios with JWT interceptor
- Tailwind CSS v3

## Features

**Buyer**
- Browse products with category filtering and pagination
- Product detail pages with quantity selector
- Persistent cart (survives page refresh)
- Register / login with JWT auth
- Checkout with shipping address
- Order confirmation and order history

**Vendor / Admin**
- Multi-store system — each product belongs to a store
- Store management
- Product management (name, price, stock, images, category)

**Technical**
- Clean Architecture — Domain → Application → Infrastructure → API
- Repository pattern with Unit of Work
- Paginated endpoints (`page`, `pageSize` query params)
- Zustand cart synced to backend DB on checkout
- Shimmer skeleton loaders and error states throughout

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                    React 19 + Vite                     │
│  HomePage │ ProductPage │ CartPage │ CheckoutPage      │
│  LoginPage │ RegisterPage │ OrdersPage                 │
└──────────────────────┬─────────────────────────────────┘
                       │ HTTP (Axios + JWT Bearer)
┌──────────────────────▼─────────────────────────────────┐
│                    .NET 10 API                         │
│  /api/auth  │  /api/products  │  /api/cart             │
│  /api/orders  │  /api/stores  │  /api/categories       │
└──────┬────────────────────────────────┬────────────────┘
       │ EF Core                        │ Clean Architecture
┌──────▼──────┐                ┌────────▼───────────────┐
│ PostgreSQL  │                │  Domain                │
│  Users      │                │  Application           │
│  Products   │                │  Infrastructure        │
│  Stores     │                │  API                   │
│  Orders     │                └────────────────────────┘
│  CartItems  │
└─────────────┘
```

## Getting Started

**Prerequisites:** .NET 10 SDK, Node 18+, PostgreSQL running locally.

**Backend**

```bash
cd src
```

Create `src/Dukkan.API/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=dukkan;Username=postgres;Password=yourpassword"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-here",
    "Issuer": "Dukkan",
    "Audience": "DukkanUsers",
    "ExpiryMinutes": 1440
  }
}
```

```bash
dotnet run --project Dukkan.API
```

API runs on `https://localhost:7016` — Swagger at `/swagger`

**Frontend**

```bash
cd client
npm install
npm run dev
```

App runs on `http://localhost:5173`

Create `client/.env`:

```
VITE_API_URL=https://localhost:7016
```

## Domain Model

- **User** — auth, JWT, role (Customer / Admin)
- **Store** — vendor profile, name, description, owner
- **Category** — product taxonomy
- **Product** — belongs to store + category, price, stock, images
- **CartItem** — user's active cart (product + quantity, persisted in DB)
- **Order** — placed order with shipping address and status (Pending / Confirmed / Shipped / Delivered)
- **OrderItem** — line items snapshotted at order time (productId, name, price, quantity)
- **Review** — one per user per product, rating + comment

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Create account |
| POST | /api/auth/login | — | Get JWT token |
| GET | /api/products | — | List products (paginated) |
| GET | /api/products/{id} | — | Product detail |
| GET | /api/categories | — | All categories |
| GET | /api/stores | — | All stores (paginated) |
| GET | /api/cart | ✓ | Get cart items |
| POST | /api/cart | ✓ | Add item to cart |
| DELETE | /api/cart | ✓ | Clear cart |
| POST | /api/orders | ✓ | Place order (reads from cart) |
| GET | /api/orders | ✓ | Order history |

## Project Structure

```
Dukkan/
├── src/                          # .NET Clean Architecture backend
│   ├── Dukkan.Domain/            # Entities, enums, interfaces
│   ├── Dukkan.Application/       # DTOs, service interfaces, business logic
│   ├── Dukkan.Infrastructure/    # EF Core, repositories, services, migrations
│   └── Dukkan.API/               # Controllers, middleware, program.cs
└── client/                       # React frontend
    └── src/
        ├── api/                  # Axios client + API functions
        ├── components/           # Shared UI (Navbar, layout)
        ├── pages/                # Route-level components
        ├── store/                # Zustand (cartStore, authStore)
        └── types/                # TypeScript interfaces
```

## Author

**Nour Khammassi** — Full-Stack Engineer
[GitHub](https://github.com/NourKHammassi)
