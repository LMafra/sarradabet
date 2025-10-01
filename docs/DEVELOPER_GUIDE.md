# 👨‍💻 SarradaBet Developer Guide

## Getting Started

This guide will help you set up your development environment and understand how to contribute to the SarradaBet project.

## Prerequisites

### Required Software

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Docker Desktop** (for database)
- **Git** (for version control)
- **VS Code** (recommended editor)

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "prisma.prisma",
    "ms-vscode.vscode-json"
  ]
}
```

## Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sarradabet
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

#### Backend Environment

Create `apps/api/.env`:

```env
# Application
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/sarradabet_dev"

# CORS
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"

# API
API_KEY="dev-api-key-12345"

# JWT (for future auth)
JWT_SECRET="dev-jwt-secret-key"
```

#### Frontend Environment

Create `apps/web/.env`:

```env
VITE_API_URL=http://localhost:3001
```

### 4. Database Setup

```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# Run migrations
cd apps/api
npm run prisma:migrate:dev

# Seed database (optional)
npm run prisma:seed
```

### 5. Start Development Servers

```bash
# From project root
npm run dev
```

This will start:

- Backend API: `http://localhost:3001`
- Frontend: `http://localhost:3000`
- Database: `localhost:5432`

## Project Structure

### Monorepo Overview

```
sarradabet/
├── apps/
│   ├── api/                 # Backend API
│   └── web/                 # Frontend React app
├── packages/
│   └── types/               # Shared TypeScript types
├── docs/                    # Documentation
├── docker-compose.yml       # Docker services
├── package.json             # Root package.json
└── turbo.json              # Turborepo configuration
```

### Backend Structure

```
apps/api/
├── src/
│   ├── core/               # Core architecture
│   ├── modules/            # Feature modules
│   ├── config/             # Configuration
│   ├── routes/             # API routes
│   ├── utils/              # Utilities
│   └── app.ts              # Application setup
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── __tests__/              # Tests
├── package.json
└── tsconfig.json
```

### Frontend Structure

```
apps/web/
├── src/
│   ├── core/               # Core architecture
│   ├── services/           # API services
│   ├── hooks/              # Custom hooks
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── types/              # TypeScript types
│   └── utils/              # Utilities
├── public/                 # Static assets
├── __tests__/              # Tests
├── package.json
└── vite.config.ts
```

## Development Workflow

### Adding a New Feature

#### 1. Backend Feature Development

**Step 1: Create the Module Structure**

```bash
mkdir -p apps/api/src/modules/your-feature/{repositories,services,controllers,routes,__tests__}
```

**Step 2: Define Types**

```typescript
// apps/api/src/modules/your-feature/types.ts
export interface YourFeature {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateYourFeatureDto {
  name: string;
}

export interface UpdateYourFeatureDto {
  name?: string;
}
```

**Step 3: Create Repository**

```typescript
// apps/api/src/modules/your-feature/repositories/YourFeatureRepository.ts
import { BaseRepository } from "../../../core/base/BaseRepository";
import { YourFeature } from "../types";

export class YourFeatureRepository extends BaseRepository<YourFeature> {
  constructor(prisma: PrismaClient) {
    super(prisma, "yourFeature");
  }

  // Add custom repository methods here
  async findByName(name: string): Promise<YourFeature | null> {
    return this.prisma.yourFeature.findFirst({
      where: { name },
    });
  }
}
```

**Step 4: Create Service**

```typescript
// apps/api/src/modules/your-feature/services/YourFeatureService.ts
import { BaseService } from "../../../core/base/BaseService";
import { YourFeatureRepository } from "../repositories/YourFeatureRepository";
import { CreateYourFeatureDto, UpdateYourFeatureDto } from "../types";

export class YourFeatureService extends BaseService<YourFeature> {
  constructor(private yourFeatureRepository: YourFeatureRepository) {
    super();
  }

  async create(data: CreateYourFeatureDto): Promise<YourFeature> {
    await this.validateBusinessRules(data);
    return this.executeBusinessLogic(() =>
      this.yourFeatureRepository.create(data),
    );
  }

  protected async validateBusinessRules(
    data: CreateYourFeatureDto,
  ): Promise<void> {
    // Add business validation logic
    const existing = await this.yourFeatureRepository.findByName(data.name);
    if (existing) {
      throw new ConflictError("Your feature with this name already exists");
    }
  }
}
```

**Step 5: Create Controller**

```typescript
// apps/api/src/modules/your-feature/controllers/YourFeatureController.ts
import { BaseController } from "../../../core/base/BaseController";
import { YourFeatureService } from "../services/YourFeatureService";
import {
  CreateYourFeatureSchema,
  UpdateYourFeatureSchema,
} from "../validation";

export class YourFeatureController extends BaseController<YourFeature> {
  constructor(private yourFeatureService: YourFeatureService) {
    super();
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = this.parseBody(req, CreateYourFeatureSchema);
    const yourFeature = await this.yourFeatureService.create(data);
    this.sendSuccess(
      res,
      { yourFeature },
      "Your feature created successfully",
      201,
    );
  }

  async list(req: Request, res: Response): Promise<void> {
    const params = this.parseQuery(req, YourFeatureQuerySchema);
    const result = await this.yourFeatureService.findMany(params);
    this.sendSuccess(res, result);
  }
}
```

**Step 6: Create Routes**

```typescript
// apps/api/src/modules/your-feature/routes/your-feature.routes.ts
import { Router } from "express";
import { YourFeatureController } from "../controllers/YourFeatureController";
import { YourFeatureService } from "../services/YourFeatureService";
import { YourFeatureRepository } from "../repositories/YourFeatureRepository";
import {
  validateBody,
  validateQuery,
} from "../../../core/middleware/ValidationMiddleware";
import { CreateYourFeatureSchema, YourFeatureQuerySchema } from "../validation";

export const yourFeatureRoutes = (router: Router): void => {
  const repository = new YourFeatureRepository(prisma);
  const service = new YourFeatureService(repository);
  const controller = new YourFeatureController(service);

  router.get(
    "/your-features",
    validateQuery(YourFeatureQuerySchema),
    controller.list.bind(controller),
  );

  router.post(
    "/your-features",
    validateBody(CreateYourFeatureSchema),
    controller.create.bind(controller),
  );
};
```

**Step 7: Add Validation Schemas**

```typescript
// apps/api/src/modules/your-feature/validation/schemas.ts
import { z } from "zod";

export const CreateYourFeatureSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
});

export const UpdateYourFeatureSchema = CreateYourFeatureSchema.partial();

export const YourFeatureQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});
```

**Step 8: Register Routes**

```typescript
// apps/api/src/routes/index.ts
import { yourFeatureRoutes } from "../modules/your-feature/routes/your-feature.routes";

// Add to existing routes
yourFeatureRoutes(router);
```

#### 2. Frontend Feature Development

**Step 1: Create Service**

```typescript
// apps/web/src/services/YourFeatureService.ts
import { BaseService } from "../core/base/BaseService";
import { YourFeature, CreateYourFeatureDto } from "../types/yourFeature";

export class YourFeatureService extends BaseService {
  async getYourFeatures(
    params?: YourFeatureQueryParams,
  ): Promise<ApiResponse<YourFeature[]>> {
    return this.request<YourFeature[]>("/your-features", { params });
  }

  async createYourFeature(
    data: CreateYourFeatureDto,
  ): Promise<ApiResponse<YourFeature>> {
    return this.request<YourFeature>("/your-features", {
      method: "POST",
      body: data,
    });
  }
}

export const yourFeatureService = new YourFeatureService();
```

**Step 2: Create Custom Hooks**

```typescript
// apps/web/src/hooks/useYourFeatures.ts
import { useQuery, useMutation } from "../core/hooks";
import { yourFeatureService } from "../services/YourFeatureService";
import { YourFeature, CreateYourFeatureDto } from "../types/yourFeature";

export const useYourFeatures = (params?: YourFeatureQueryParams) => {
  return useQuery(
    `your-features-${JSON.stringify(params)}`,
    () => yourFeatureService.getYourFeatures(params),
    { staleTime: 30000 },
  );
};

export const useCreateYourFeature = () => {
  return useMutation(yourFeatureService.createYourFeature, {
    onSuccess: () => {
      queryClient.invalidateQueries(["your-features"]);
    },
  });
};
```

**Step 3: Create Components**

```typescript
// apps/web/src/components/YourFeatureCard.tsx
import React from 'react';
import { YourFeature } from '../types/yourFeature';
import { Button } from './ui/Button';

interface YourFeatureCardProps {
  yourFeature: YourFeature;
  onEdit?: (yourFeature: YourFeature) => void;
  onDelete?: (id: number) => void;
}

export const YourFeatureCard: React.FC<YourFeatureCardProps> = ({
  yourFeature,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">{yourFeature.name}</h3>
      <div className="flex gap-2">
        {onEdit && (
          <Button variant="secondary" onClick={() => onEdit(yourFeature)}>
            Edit
          </Button>
        )}
        {onDelete && (
          <Button variant="danger" onClick={() => onDelete(yourFeature.id)}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};
```

**Step 4: Create Page Component**

```typescript
// apps/web/src/pages/YourFeaturesPage.tsx
import React from 'react';
import { useYourFeatures, useCreateYourFeature } from '../hooks/useYourFeatures';
import { YourFeatureCard } from '../components/YourFeatureCard';
import { Button } from '../components/ui/Button';

export const YourFeaturesPage: React.FC = () => {
  const { data: yourFeatures, loading, error } = useYourFeatures();
  const createYourFeature = useCreateYourFeature();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Features</h1>
        <Button onClick={() => createYourFeature.mutate({ name: 'New Feature' })}>
          Create Feature
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {yourFeatures?.map((yourFeature) => (
          <YourFeatureCard
            key={yourFeature.id}
            yourFeature={yourFeature}
          />
        ))}
      </div>
    </div>
  );
};
```

## Testing

### Backend Testing

**Unit Tests:**

```typescript
// apps/api/src/modules/your-feature/__tests__/YourFeatureService.test.ts
import { YourFeatureService } from "../services/YourFeatureService";
import { YourFeatureRepository } from "../services/YourFeatureRepository";
import { ConflictError } from "../../../core/errors/AppError";

describe("YourFeatureService", () => {
  let service: YourFeatureService;
  let mockRepository: jest.Mocked<YourFeatureRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findByName: jest.fn(),
    } as any;
    service = new YourFeatureService(mockRepository);
  });

  describe("create", () => {
    it("should create a new your feature", async () => {
      const data = { name: "Test Feature" };
      const expectedFeature = {
        id: 1,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findByName.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(expectedFeature);

      const result = await service.create(data);

      expect(result).toEqual(expectedFeature);
      expect(mockRepository.create).toHaveBeenCalledWith(data);
    });

    it("should throw ConflictError if feature with same name exists", async () => {
      const data = { name: "Existing Feature" };
      const existingFeature = {
        id: 1,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findByName.mockResolvedValue(existingFeature);

      await expect(service.create(data)).rejects.toThrow(ConflictError);
    });
  });
});
```

**Integration Tests:**

```typescript
// apps/api/src/__tests__/integration/your-feature.routes.test.ts
import request from "supertest";
import { app } from "../../app";

describe("Your Feature Routes", () => {
  describe("POST /api/v1/your-features", () => {
    it("should create a new your feature", async () => {
      const featureData = { name: "Test Feature" };

      const response = await request(app)
        .post("/api/v1/your-features")
        .set("X-API-Key", "test-api-key")
        .send(featureData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.yourFeature.name).toBe(featureData.name);
    });

    it("should return validation error for invalid data", async () => {
      const invalidData = { name: "" };

      const response = await request(app)
        .post("/api/v1/your-features")
        .set("X-API-Key", "test-api-key")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveLength(1);
    });
  });
});
```

### Frontend Testing

**Component Tests:**

```typescript
// apps/web/src/components/__tests__/YourFeatureCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { YourFeatureCard } from '../YourFeatureCard';

const mockYourFeature = {
  id: 1,
  name: 'Test Feature',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
};

describe('YourFeatureCard', () => {
  it('should render your feature name', () => {
    render(<YourFeatureCard yourFeature={mockYourFeature} />);
    expect(screen.getByText('Test Feature')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<YourFeatureCard yourFeature={mockYourFeature} onEdit={onEdit} />);

    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(mockYourFeature);
  });
});
```

**Hook Tests:**

```typescript
// apps/web/src/hooks/__tests__/useYourFeatures.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { useYourFeatures } from "../useYourFeatures";
import { yourFeatureService } from "../../services/YourFeatureService";

jest.mock("../../services/YourFeatureService");

describe("useYourFeatures", () => {
  it("should fetch your features", async () => {
    const mockFeatures = [mockYourFeature];
    (yourFeatureService.getYourFeatures as jest.Mock).mockResolvedValue({
      success: true,
      data: mockFeatures,
    });

    const { result } = renderHook(() => useYourFeatures());

    await waitFor(() => {
      expect(result.current.data).toEqual(mockFeatures);
    });
  });
});
```

## Code Style and Standards

### TypeScript

**Strict Configuration:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Naming Conventions:**

- **PascalCase**: Classes, interfaces, types, enums
- **camelCase**: Variables, functions, methods
- **UPPER_SNAKE_CASE**: Constants
- **kebab-case**: File names, URLs

### React

**Component Guidelines:**

- Use functional components with hooks
- Prefer composition over inheritance
- Use TypeScript for all components
- Follow the single responsibility principle

**Hook Guidelines:**

- Use custom hooks for reusable logic
- Keep hooks focused and simple
- Use proper dependency arrays
- Handle loading and error states

### Backend

**Service Guidelines:**

- Keep business logic in services
- Use dependency injection
- Handle errors appropriately
- Write comprehensive tests

**Repository Guidelines:**

- Keep data access logic in repositories
- Use Prisma ORM efficiently
- Handle database errors
- Implement proper pagination

## Git Workflow

### Branch Naming

- `feature/your-feature-name` - New features
- `fix/issue-description` - Bug fixes
- `refactor/component-name` - Code refactoring
- `docs/documentation-update` - Documentation updates

### Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

**Examples:**

```
feat(bets): add bet creation endpoint
fix(validation): handle empty string validation
docs(api): update endpoint documentation
refactor(services): extract common validation logic
```

### Pull Request Process

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes and Commit**

   ```bash
   git add .
   git commit -m "feat(your-feature): add new functionality"
   ```

3. **Push and Create PR**

   ```bash
   git push origin feature/your-feature-name
   ```

4. **PR Requirements**
   - Clear description of changes
   - Link to related issues
   - Include screenshots for UI changes
   - Ensure all tests pass
   - Request code review

## Debugging

### Backend Debugging

**VS Code Debug Configuration:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug API",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/apps/api/src/server.ts",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

**Database Debugging:**

```bash
# Connect to database
docker exec -it sarradabet-postgres psql -U postgres -d sarradabet_dev

# View logs
docker logs sarradabet-postgres
```

### Frontend Debugging

**React DevTools:**

- Install React Developer Tools browser extension
- Use React DevTools Profiler for performance debugging

**Network Debugging:**

- Use browser DevTools Network tab
- Check API request/response details
- Monitor WebSocket connections

## Performance Optimization

### Backend Optimization

**Database:**

- Add proper indexes
- Optimize queries
- Use connection pooling
- Implement caching

**API:**

- Implement rate limiting
- Use compression
- Optimize response sizes
- Cache frequently accessed data

### Frontend Optimization

**React:**

- Use React.memo for expensive components
- Implement code splitting
- Optimize re-renders
- Use proper key props

**Bundle:**

- Analyze bundle size
- Remove unused code
- Optimize images
- Use CDN for static assets

## Common Issues and Solutions

### Backend Issues

**Database Connection Issues:**

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart database
docker-compose restart postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

**TypeScript Compilation Errors:**

```bash
# Clear build cache
rm -rf apps/api/dist
rm -rf node_modules/.cache

# Rebuild
npm run build
```

### Frontend Issues

**Build Errors:**

```bash
# Clear cache
rm -rf apps/web/dist
rm -rf node_modules/.vite

# Reinstall dependencies
npm install
```

**Hot Reload Issues:**

```bash
# Restart dev server
npm run dev
```

## Resources

### Documentation

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### Tools

- [VS Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/) (API testing)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Learning Resources

- [Clean Architecture Book](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Patterns](https://reactpatterns.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

Happy coding! 🚀 If you have any questions or need help, don't hesitate to ask in the project's issue tracker or reach out to the development team.
