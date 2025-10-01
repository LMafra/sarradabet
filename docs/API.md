# 📚 SarradaBet API Documentation

## Overview

The SarradaBet API is a RESTful API built with Express.js and TypeScript, following clean architecture principles. It provides endpoints for managing betting markets, categories, and votes.

## Base Information

- **Base URL**: `http://localhost:3001/api/v1`
- **Protocol**: HTTP/HTTPS
- **Content Type**: `application/json`
- **Authentication**: API Key (Header: `X-API-Key`)

## Authentication

### API Key Authentication

Include your API key in the request headers:

```http
X-API-Key: your-api-key-here
```

### Error Responses

If authentication fails:

```json
{
  "success": false,
  "message": "Unauthorized access",
  "errors": [
    {
      "field": "authentication",
      "message": "Invalid or missing API key",
      "code": "UNAUTHORIZED"
    }
  ],
  "requestId": "req_123456789",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Response Format

### Success Response

All successful API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message",
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

### Error Response

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error message",
      "code": "ERROR_CODE"
    }
  ],
  "requestId": "unique-request-id",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Data Models

### Bet

```typescript
interface Bet {
  id: number;
  title: string;
  description: string | null;
  status: "open" | "closed" | "resolved";
  categoryId: number | null;
  createdAt: string; // ISO 8601 date
  updatedAt: string; // ISO 8601 date
  resolvedAt: string | null; // ISO 8601 date
  odds: Odd[];
  totalVotes?: number;
}
```

### Odd

```typescript
interface Odd {
  id: number;
  title: string;
  value: number; // Decimal odds (e.g., 2.50)
  totalVotes: number;
  result: "pending" | "won" | "lost" | null;
  betId: number;
}
```

### Category

```typescript
interface Category {
  id: number;
  title: string;
  createdAt: string; // ISO 8601 date
  updatedAt: string; // ISO 8601 date
  _count?: {
    bet: number;
  };
}
```

### Vote

```typescript
interface Vote {
  id: number;
  oddId: number;
  createdAt: string; // ISO 8601 date
  odd?: Odd; // Included when fetching with relations
}
```

## Endpoints

### Health Check

#### GET /health

Check API health status.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

---

## Bet Endpoints

### List Bets

#### GET /bets

Retrieve all bets with optional filtering and pagination.

**Query Parameters:**

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `status` (string, optional): Filter by status (`open`, `closed`, `resolved`)
- `categoryId` (number, optional): Filter by category ID
- `search` (string, optional): Search in title and description
- `sortBy` (string, optional): Sort field (default: `createdAt`)
- `sortOrder` (string, optional): Sort order (`asc` or `desc`, default: `desc`)

**Example Request:**

```http
GET /api/v1/bets?page=1&limit=10&status=open&sortBy=createdAt&sortOrder=desc
```

**Response:**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "title": "Will Team A win?",
        "description": "Championship final match",
        "status": "open",
        "categoryId": 1,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "resolvedAt": null,
        "odds": [
          {
            "id": 1,
            "title": "Yes",
            "value": 2.5,
            "totalVotes": 45,
            "result": "pending"
          },
          {
            "id": 2,
            "title": "No",
            "value": 1.67,
            "totalVotes": 67,
            "result": "pending"
          }
        ],
        "totalVotes": 112
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Get Single Bet

#### GET /bets/:id

Retrieve a specific bet by ID.

**Path Parameters:**

- `id` (number, required): Bet ID

**Response:**

```json
{
  "success": true,
  "data": {
    "bet": {
      "id": 1,
      "title": "Will Team A win?",
      "description": "Championship final match",
      "status": "open",
      "categoryId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "resolvedAt": null,
      "odds": [
        {
          "id": 1,
          "title": "Yes",
          "value": 2.5,
          "totalVotes": 45,
          "result": "pending"
        }
      ]
    }
  }
}
```

### Create Bet

#### POST /bets

Create a new bet.

**Request Body:**

```json
{
  "title": "Will Team A win?",
  "description": "Championship final match",
  "categoryId": 1,
  "odds": [
    {
      "title": "Yes",
      "value": 2.5
    },
    {
      "title": "No",
      "value": 1.67
    }
  ]
}
```

**Validation Rules:**

- `title`: Required, 2-255 characters, valid characters only
- `description`: Optional, max 1000 characters
- `categoryId`: Optional, must exist in database
- `odds`: Required, 2-10 odds, unique titles, values between 1.01-1000

**Response:**

```json
{
  "success": true,
  "data": {
    "bet": {
      "id": 1,
      "title": "Will Team A win?",
      "description": "Championship final match",
      "status": "open",
      "categoryId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "resolvedAt": null,
      "odds": [
        {
          "id": 1,
          "title": "Yes",
          "value": 2.5,
          "totalVotes": 0,
          "result": "pending"
        }
      ]
    }
  },
  "message": "Bet created successfully"
}
```

### Update Bet

#### PUT /bets/:id

Update an existing bet.

**Path Parameters:**

- `id` (number, required): Bet ID

**Request Body:**

```json
{
  "title": "Updated bet title",
  "description": "Updated description",
  "status": "closed"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "bet": {
      "id": 1,
      "title": "Updated bet title",
      "description": "Updated description",
      "status": "closed",
      "categoryId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "resolvedAt": null,
      "odds": []
    }
  },
  "message": "Bet updated successfully"
}
```

### Delete Bet

#### DELETE /bets/:id

Delete a bet (only if it has no votes).

**Path Parameters:**

- `id` (number, required): Bet ID

**Response:**

```json
{
  "success": true,
  "message": "Bet deleted successfully"
}
```

### Close Bet

#### PATCH /bets/:id/close

Close a bet to prevent new votes.

**Path Parameters:**

- `id` (number, required): Bet ID

**Response:**

```json
{
  "success": true,
  "data": {
    "bet": {
      "id": 1,
      "title": "Will Team A win?",
      "status": "closed",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Bet closed successfully"
}
```

### Resolve Bet

#### PATCH /bets/:id/resolve

Resolve a bet by specifying the winning odd.

**Path Parameters:**

- `id` (number, required): Bet ID

**Request Body:**

```json
{
  "winningOddId": 1
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "bet": {
      "id": 1,
      "title": "Will Team A win?",
      "status": "resolved",
      "resolvedAt": "2024-01-01T00:00:00.000Z",
      "odds": [
        {
          "id": 1,
          "title": "Yes",
          "result": "won"
        },
        {
          "id": 2,
          "title": "No",
          "result": "lost"
        }
      ]
    }
  },
  "message": "Bet resolved successfully"
}
```

---

## Category Endpoints

### List Categories

#### GET /categories

Retrieve all categories with optional filtering and pagination.

**Query Parameters:**

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `search` (string, optional): Search in title
- `sortBy` (string, optional): Sort field (default: `createdAt`)
- `sortOrder` (string, optional): Sort order (`asc` or `desc`, default: `desc`)

**Response:**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "title": "Sports",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "_count": {
          "bet": 15
        }
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### Get Single Category

#### GET /categories/:id

Retrieve a specific category by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "category": {
      "id": 1,
      "title": "Sports",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Create Category

#### POST /categories

Create a new category.

**Request Body:**

```json
{
  "title": "Entertainment"
}
```

**Validation Rules:**

- `title`: Required, 2-50 characters, valid characters only

**Response:**

```json
{
  "success": true,
  "data": {
    "category": {
      "id": 2,
      "title": "Entertainment",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Category created successfully"
}
```

### Update Category

#### PUT /categories/:id

Update an existing category.

**Request Body:**

```json
{
  "title": "Updated Category Name"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "category": {
      "id": 1,
      "title": "Updated Category Name",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Category updated successfully"
}
```

### Delete Category

#### DELETE /categories/:id

Delete a category (only if it has no associated bets).

**Response:**

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## Vote Endpoints

### List Votes

#### GET /votes

Retrieve all votes with optional filtering and pagination.

**Query Parameters:**

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `betId` (number, optional): Filter by bet ID
- `oddId` (number, optional): Filter by odd ID

**Response:**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "oddId": 1,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Get Single Vote

#### GET /votes/:id

Retrieve a specific vote by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "vote": {
      "id": 1,
      "oddId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "odd": {
        "id": 1,
        "title": "Yes",
        "value": 2.5,
        "betId": 1
      }
    }
  }
}
```

### Create Vote

#### POST /votes

Create a new vote.

**Request Body:**

```json
{
  "oddId": 1
}
```

**Validation Rules:**

- `oddId`: Required, must exist and belong to an open bet

**Response:**

```json
{
  "success": true,
  "data": {
    "vote": {
      "id": 1,
      "oddId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Vote created successfully"
}
```

## Error Codes

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid API key)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate or business rule violation)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `NOT_FOUND` - Resource not found
- `DUPLICATE` - Duplicate entry
- `CONFLICT` - Business rule violation
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Access denied
- `RATE_LIMIT` - Too many requests
- `DATABASE_ERROR` - Database operation failed

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP address
- **Headers**: Rate limit information included in response headers
- **Error**: 429 status code when limit exceeded

## Security

### Security Headers

The API includes comprehensive security headers:

- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`

### Input Validation

All inputs are validated and sanitized:

- String sanitization (trimming, character filtering)
- Type validation and coercion
- Length and format validation
- Business logic validation

### CORS

Cross-Origin Resource Sharing is configured with:

- Origin whitelist support
- Credential support
- Configurable allowed methods and headers

## Examples

### Complete Betting Flow

1. **Create a category:**

   ```bash
   curl -X POST http://localhost:3001/api/v1/categories \
     -H "Content-Type: application/json" \
     -H "X-API-Key: your-api-key" \
     -d '{"title": "Sports"}'
   ```

2. **Create a bet:**

   ```bash
   curl -X POST http://localhost:3001/api/v1/bets \
     -H "Content-Type: application/json" \
     -H "X-API-Key: your-api-key" \
     -d '{
       "title": "Will Team A win?",
       "categoryId": 1,
       "odds": [
         {"title": "Yes", "value": 2.50},
         {"title": "No", "value": 1.67}
       ]
     }'
   ```

3. **Vote on an odd:**

   ```bash
   curl -X POST http://localhost:3001/api/v1/votes \
     -H "Content-Type: application/json" \
     -H "X-API-Key: your-api-key" \
     -d '{"oddId": 1}'
   ```

4. **Close the bet:**

   ```bash
   curl -X PATCH http://localhost:3001/api/v1/bets/1/close \
     -H "X-API-Key: your-api-key"
   ```

5. **Resolve the bet:**
   ```bash
   curl -X PATCH http://localhost:3001/api/v1/bets/1/resolve \
     -H "Content-Type: application/json" \
     -H "X-API-Key: your-api-key" \
     -d '{"winningOddId": 1}'
   ```

## SDKs and Libraries

### JavaScript/TypeScript

```typescript
import {
  BetService,
  CategoryService,
  VoteService,
} from "@sarradabet/api-client";

const betService = new BetService({
  baseURL: "http://localhost:3001/api/v1",
  apiKey: "your-api-key",
});

// Create a bet
const bet = await betService.create({
  title: "Will Team A win?",
  categoryId: 1,
  odds: [
    { title: "Yes", value: 2.5 },
    { title: "No", value: 1.67 },
  ],
});
```

### Python

```python
import requests

class SarradaBetClient:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.headers = {
            'Content-Type': 'application/json',
            'X-API-Key': api_key
        }

    def create_bet(self, bet_data):
        response = requests.post(
            f'{self.base_url}/bets',
            json=bet_data,
            headers=self.headers
        )
        return response.json()

client = SarradaBetClient('http://localhost:3001/api/v1', 'your-api-key')
```

## Support

For API support:

- Check the health endpoint: `GET /health`
- Review error responses for debugging
- Check request/response formats
- Verify authentication headers
- Ensure proper content types

For additional help, please refer to the main project documentation or create an issue in the repository.
