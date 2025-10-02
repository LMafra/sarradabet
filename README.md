# 🎰 SarradaBet - Mock Betting Platform

[![CI](https://github.com/LMafra/sarradabet/actions/workflows/ci.yml/badge.svg)](https://github.com/LMafra/sarradabet/actions/workflows/ci.yml)
[![Security Scan](https://github.com/LMafra/sarradabet/actions/workflows/security.yml/badge.svg)](https://github.com/LMafra/sarradabet/actions/workflows/security.yml)
[![Deploy](https://github.com/LMafra/sarradabet/actions/workflows/deploy.yml/badge.svg)](https://github.com/LMafra/sarradabet/actions/workflows/deploy.yml)
[![Dependency Update](https://github.com/LMafra/sarradabet/actions/workflows/dependency-update.yml/badge.svg)](https://github.com/LMafra/sarradabet/actions/workflows/dependency-update.yml)
[![PR](https://github.com/LMafra/sarradabet/actions/workflows/pr.yml/badge.svg)](https://github.com/LMafra/sarradabet/actions/workflows/pr.yml)

A modern, full-stack betting platform built with clean architecture principles, featuring real-time odds, voting systems, and comprehensive validation.

## 🚀 Features

### Core Functionality

- **Betting System**: Create and manage betting markets with multiple odds
- **Voting Mechanism**: Users can vote on betting options with real-time updates
- **Category Management**: Organize bets by categories with statistics
- **Real-time Updates**: Live odds and vote counts
- **Admin Panel**: Comprehensive admin interface for bet management

### Technical Features

- **Clean Architecture**: Separation of concerns with repositories, services, and controllers
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Advanced Validation**: Comprehensive input validation and sanitization
- **Security**: Rate limiting, CORS protection, and security headers
- **Testing**: Unit tests, integration tests, and component tests
- **Error Handling**: Detailed error responses with request tracking

## 🏗️ Architecture

### Monorepo Structure

```
sarradabet/
├── apps/
│   ├── api/          # Backend API (Express.js + TypeScript)
│   └── web/          # Frontend (React + TypeScript)
├── packages/
│   └── types/        # Shared TypeScript types
├── docs/             # Documentation
└── docker-compose.yml
```

### Backend Architecture (Clean Architecture)

```
apps/api/src/
├── core/                    # Core architecture
│   ├── interfaces/         # Base interfaces
│   ├── base/              # Base classes
│   ├── errors/            # Custom error classes
│   ├── validation/        # Validation schemas
│   └── middleware/        # Core middleware
├── modules/               # Feature modules
│   ├── bet/              # Bet management
│   ├── category/         # Category management
│   └── vote/             # Voting system
├── config/               # Configuration
├── routes/               # API routes
└── utils/                # Utilities
```

### Frontend Architecture (Modern React)

```
apps/web/src/
├── core/                 # Core architecture
│   ├── hooks/           # Custom hooks
│   ├── interfaces/      # TypeScript interfaces
│   └── base/            # Base classes
├── services/            # API services
├── hooks/               # Domain-specific hooks
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── [feature]/      # Feature-specific components
├── pages/               # Page components
├── types/               # TypeScript types
└── utils/               # Utility functions
```

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Security**: Helmet.js, Express Rate Limit

### Frontend

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **State Management**: Custom hooks with React Query patterns

### DevOps

- **Containerization**: Docker
- **Monorepo**: Turborepo
- **Package Manager**: npm
- **Version Control**: Git

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker Desktop
- npm 9+

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sarradabet
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp apps/api/.env.example apps/api/.env
   # Edit the .env file with your database credentials
   ```

4. **Start the database**

   ```bash
   docker-compose up -d postgres
   ```

5. **Run database migrations**

   ```bash
   cd apps/api
   npm run prisma:migrate:dev
   ```

6. **Start development servers**
   ```bash
   # From project root
   npm run dev
   ```

This will start:

- Backend API on `http://localhost:3001`
- Frontend on `http://localhost:3000`
- PostgreSQL on `localhost:5432`

## 📖 API Documentation

### Base URL

```
http://localhost:3001/api/v1
```

### Authentication

Currently, the API uses API key authentication. Include your API key in the request headers:

```http
X-API-Key: your-api-key-here
```

### Endpoints

#### Bets

- `GET /bets` - Get all bets with pagination
- `GET /bets/:id` - Get a specific bet
- `POST /bets` - Create a new bet
- `PUT /bets/:id` - Update a bet
- `DELETE /bets/:id` - Delete a bet
- `PATCH /bets/:id/close` - Close a bet
- `PATCH /bets/:id/resolve` - Resolve a bet with winning odd

#### Categories

- `GET /categories` - Get all categories
- `GET /categories/:id` - Get a specific category
- `POST /categories` - Create a new category
- `PUT /categories/:id` - Update a category
- `DELETE /categories/:id` - Delete a category

#### Votes

- `GET /votes` - Get all votes
- `GET /votes/:id` - Get a specific vote
- `POST /votes` - Create a new vote

### Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Format

Error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error",
      "code": "ERROR_CODE"
    }
  ],
  "requestId": "unique-request-id",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🧪 Testing

### Backend Tests

```bash
cd apps/api
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
npm run test:unit       # Unit tests only
npm run test:integration # Integration tests only
```

### Frontend Tests

```bash
cd apps/web
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
npm run test:ui         # Visual test runner
```

## 🏗️ Development

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for both frontend and backend
- **Prettier**: Code formatting (if configured)
- **Husky**: Git hooks for code quality (if configured)

### Adding New Features

1. **Backend**: Follow the clean architecture pattern

   - Create repository for data access
   - Create service for business logic
   - Create controller for request handling
   - Add validation schemas
   - Write tests

2. **Frontend**: Follow React best practices
   - Create service for API calls
   - Create custom hooks for state management
   - Create UI components
   - Write component tests

### Database Schema

The application uses the following main entities:

- **Bets**: Betting markets with multiple odds
- **Odds**: Individual betting options within a bet
- **Categories**: Organization of bets
- **Votes**: User votes on odds
- **Admins**: Admin users for management

## 🔒 Security

### Implemented Security Measures

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive validation using Zod
- **Input Sanitization**: Automatic cleaning of user inputs
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Origin-based access control
- **Error Handling**: Secure error responses without sensitive data

### Security Best Practices

- Environment variables for sensitive data
- Request size limiting
- SQL injection prevention through Prisma ORM
- XSS protection through input sanitization
- CSRF protection through CORS configuration

## 📊 Monitoring & Logging

### Logging

- **Winston**: Structured logging with different levels
- **Request Tracking**: Unique request IDs for debugging
- **Error Context**: Detailed error information with context

### Health Checks

- `GET /health` - API health check endpoint
- Database connection monitoring
- Service availability checks

## 🚀 Deployment

### Production Build

```bash
# Build both frontend and backend
npm run build

# Start production servers
npm start
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Environment Variables

#### Backend (.env)

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/sarradabet
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
API_KEY=your-secure-api-key
JWT_SECRET=your-jwt-secret
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Development Guidelines

- Follow the established architecture patterns
- Write comprehensive tests
- Update documentation for new features
- Use meaningful commit messages
- Ensure TypeScript compilation passes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation in the `/docs` folder
- Review the API documentation above

## 🎯 Roadmap

### Planned Features

- [ ] User authentication and authorization
- [ ] Real-time notifications with WebSockets
- [ ] Advanced betting analytics
- [ ] Mobile app with React Native
- [ ] Payment integration
- [ ] Advanced admin dashboard
- [ ] API rate limiting per user
- [ ] Comprehensive audit logging

---

**Built with ❤️ using Clean Architecture principles and modern web technologies.**
