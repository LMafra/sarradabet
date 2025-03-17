# SarradaBet - Mock Betting Platform 🎲

**A modern betting platform prototype** built with Turborepo, featuring real-time odds, voting system, and admin controls. Designed to demonstrate full-stack monorepo development best practices.

![Project Screenshot](./path-to-screenshot.png) <!-- Add actual screenshot path -->

## 🚀 Features

- **Core Betting Functionality**
  - Create & manage betting markets
  - Dynamic odds with crowd voting system
  - Real-time resolution tracking
- **Admin Controls**
  - Market moderation
  - Action audit logging
  - User management
- **Modern Stack**
  - Monorepo architecture with Turborepo
  - Type-safe API interactions
  - PostgreSQL database with Prisma ORM

## ⚙️ Tech Stack

**Frontend**

- React + Vite
- TypeScript
- Tailwind CSS
- TanStack Query

**Backend**

- Express.js
- Prisma ORM
- PostgreSQL
- Zod Validation

**Tooling**

- Turborepo
- ESLint + Prettier
- GitHub Actions (CI/CD)
- Vercel Deployment

## 📦 Monorepo Structure

```bash
sarradabet/
├── apps/
│   ├── web       # Frontend application
│   └── api       # Backend server
├── packages/
│   ├── config    # Shared ESLint/Tailwind configs
│   ├── database  # Prisma schema & client
│   └── types     # Shared TypeScript types
└── turbo.json    # Turborepo configuration
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- NPM 8+

#### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/sarradabet.git
cd sarradabet


# Install dependencies
npm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
```

#### Database Setup

```bash

# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

#### Running Locally

```bash
# Start all services
npm run dev

# Frontend only
npm run dev --filter=web

# Backend only
npm run dev --filter=api
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (git checkout -b feature/amazing-feature)
3. Commit changes (git commit -m 'Add amazing feature')
4. Push to branch (git push origin feature/amazing-feature)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See LICENSE for more information.
