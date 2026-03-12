# AI Backend API

A production-ready Express.js backend with Redis integration, featuring modern architecture patterns, security best practices, and comprehensive error handling.

## Architecture

```
├── server.js              # Entry point
├── src/
│   ├── app.js            # Express app configuration
│   ├── config/           # Configuration management
│   │   └── index.js
│   ├── controllers/      # Request handlers
│   │   ├── healthController.js
│   │   └── messageController.js
│   ├── middleware/       # Express middlewares
│   │   ├── errorHandler.js
│   │   ├── security.js
│   │   └── validator.js
│   ├── routes/           # Route definitions
│   │   ├── healthRoutes.js
│   │   └── messageRoutes.js
│   └── services/         # Business logic
│       ├── logger.js
│       └── redis.js
├── .env.example          # Environment variables template
└── package.json
```

## Features

### Security
- **Helmet.js** - Secure HTTP headers
- **CORS** - Cross-origin resource sharing configuration
- **Rate Limiting** - Request throttling per IP
- **Input Validation** - Request body validation with express-validator

### Error Handling
- Centralized error handling middleware
- Custom `AppError` class for operational errors
- Async handler wrapper for clean async/await code
- Graceful shutdown on SIGTERM/SIGINT

### Logging
- **Winston** logger with structured logging
- Console and file transports
- Separate error and combined logs
- Request logging with timing

### API Endpoints

#### Health Check
```
GET  /api/health         # Basic health status
GET  /api/health/redis   # Redis connection status
GET  /api/health/system  # System info and memory usage
```

#### Messages
```
POST /api/messages       # Store a message
GET  /api/messages       # Get paginated messages
GET  /api/messages/latest # Get latest message
```

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- Redis server

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# REDIS_URL=redis://localhost:6379

# Run in development mode
npm run dev

# Run in production mode
npm start
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment mode | development |
| `REDIS_URL` | Redis connection URL | required |
| `CORS_ORIGIN` | Allowed CORS origins | * |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15min) |
| `RATE_LIMIT_MAX` | Max requests per window | 100 |

## Scripts

```bash
npm run dev          # Development with hot reload
npm start            # Production start
npm test             # Run tests
npm run test:coverage # Run tests with coverage
npm run lint         # ESLint check
npm run lint:fix     # ESLint fix
npm run format       # Prettier format
```

## API Response Format

### Success Response
```json
{
  "status": "success",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "fail",
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## Example Usage

```bash
# Check health
curl http://localhost:3001/api/health

# Store a message
curl -X POST http://localhost:3001/api/messages \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, World!"}'

# Get messages with pagination
curl "http://localhost:3001/api/messages?page=1&limit=10"

# Get latest message
curl http://localhost:3001/api/messages/latest
```
