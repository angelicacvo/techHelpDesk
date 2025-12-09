# TechHelpDesk - Technical Support System

**Developed by:** Angelica Correa Villegas - Clan Musa  
**Repository:** https://github.com/angelicacvo/techHelpDesk

---

## Project Description

Complete REST API for technical support ticket management developed with **NestJS**, **TypeORM** and **PostgreSQL**. Implements JWT authentication, role-based system, advanced validations, transform interceptors and automatic Swagger documentation.

### Main Features

- JWT Authentication with custom Guards and Strategies
- Role System: Administrator, Technician, Client
- Complete Ticket Management (CRUD + history + assignment)
- Advanced Validations: Workload, states, relationships
- Transform Interceptor: Standardized responses
- Swagger Documentation: Fully documented endpoints
- Unit Tests with Jest: 76+ tests, coverage >56%
- Seeders with Faker: Realistic test data
- Docker Ready: Deployment with docker-compose
- SOLID Principles: Clean and maintainable code

---

## Installation and Configuration

### Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** 14+ (or Supabase account)
- **Docker** and **Docker Compose** (optional but recommended)

### Option 1: Local Installation

```bash
# 1. Clone the repository
git clone https://github.com/angelicacvo/techHelpDesk.git
cd tech-help-desk

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# 4. Populate database with test data
npm run seed

# 5. Start in development mode
npm run start:dev
```

### Option 2: With Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/angelicacvo/techHelpDesk.git
cd tech-help-desk

# 2. Configure environment variables
cp .env.example .env
# Edit .env with Supabase credentials or local PostgreSQL

# 3. Start container
docker-compose up -d --build

# 4. View logs
docker logs tech-help-desk-app -f

# The application will be available at http://localhost:3004
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3004
NODE_ENV=development

# Database (Supabase or local PostgreSQL)
DB_HOST=aws-1-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_USERNAME=postgres.xxxxxxxxxxxxx
DB_PASSWORD=your_password_here
DB_DATABASE=postgres

# JWT Authentication
JWT_SECRET=your_super_secure_jwt_secret_here
JWT_EXPIRES_IN=1d
```

**Note:** For local PostgreSQL, use:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=tech_help_desk
```

---

## API Documentation (Swagger)

Once the application is started, access the interactive documentation:

**URL:** http://localhost:3004/api/docs

### Main Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

#### Users (Admin Only)
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

#### Categories (Admin)
- `GET /categories` - List all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create new category
- `PATCH /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

#### Clients (Admin)
- `GET /clients` - List all clients
- `GET /clients/:id` - Get client by ID
- `POST /clients` - Create new client
- `PATCH /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client

#### Technicians (Admin)
- `GET /technicians` - List all technicians
- `GET /technicians/:id` - Get technician by ID
- `POST /technicians` - Create new technician
- `PATCH /technicians/:id` - Update technician
- `DELETE /technicians/:id` - Delete technician

#### Tickets
- `GET /tickets` - List all tickets (Admin)
- `GET /tickets/:id` - Get specific ticket
- `POST /tickets` - Create new ticket (Client/Admin)
- `PATCH /tickets/:id` - Update ticket
- `PATCH /tickets/:id/status` - Change status (Technician/Admin)
- `GET /tickets/client/:clientId` - History by client
- `GET /tickets/technician/:technicianId` - Tickets by technician

### Usage Example with cURL

```bash
# 1. Login to get token
curl -X POST http://localhost:3004/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@techhelpdesk.com",
    "password": "Admin123!"
  }'

# 2. Create ticket (using JWT token)
curl -X POST http://localhost:3004/tickets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "HP LaserJet Printer Error",
    "description": "Printer not responding and showing error E02",
    "priority": "high",
    "categoryId": 2,
    "clientId": 1,
    "technicianId": 1
  }'

# 3. Query client tickets
curl -X GET http://localhost:3004/tickets/client/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing

The project includes comprehensive unit tests with Jest.

```bash
# Run all tests
npm run test

# Tests with coverage
npm run test:cov

# Tests in watch mode (development)
npm run test:watch

# E2E tests
npm run test:e2e
```

**Current Coverage:** 56.3% (exceeds minimum required 40%)  
**Total Tests:** 76 tests (100% passing)

### Implemented Tests

- Ticket creation with validations
- Ticket status change
- Technician workload validation
- Authentication and authorization
- Complete CRUD for all entities
- Custom validators

---

## Project Architecture

### Folder Structure

```
src/
├── auth/                       # Authentication module
│   ├── guards/                # JwtAuthGuard, RolesGuard
│   ├── strategies/            # JWT Strategy (Passport)
│   └── decorators/            # @Roles(), @Public()
├── categories/                # Categories module
├── clients/                   # Clients module
├── common/                    # Shared utilities
│   ├── enums/                # UserRole, TicketStatus, etc.
│   ├── filters/              # HttpExceptionFilter
│   ├── interceptors/         # TransformInterceptor
│   └── validators/           # Custom validators
├── decorators/               # @CurrentUser() decorator
├── technicians/              # Technicians module
├── tickets/                  # Tickets module
│   ├── pipes/               # TicketStatusValidationPipe
│   └── dto/                 # CreateTicketDto, UpdateTicketDto
├── users/                    # Users module
├── database/                 # Database configuration
│   ├── seeds/               # Seeders with Faker
│   └── factories/           # Factories for test data
└── main.ts                   # Entry point

docker-compose.yml            # Docker orchestration
Dockerfile                    # Multi-stage Docker image
.dockerignore                 # Build optimization
```

### Implemented SOLID Principles

The project strictly follows SOLID principles:

- **S**ingle Responsibility: Each class has a single well-defined responsibility
- **O**pen/Closed: Extensible through decorators, guards and interceptors
- **L**iskov Substitution: Guards and Strategies substitutable following NestJS interfaces
- **I**nterface Segregation: Domain-specific interfaces
- **D**ependency Inversion: Dependency injection throughout the application

---

## Roles and Permissions System

### Available Roles

| Role | Description | Permissions |
|-----|-------------|----------|
| **ADMIN** | System administrator | Complete CRUD of users, technicians, clients, categories and tickets |
| **TECHNICIAN** | Support technician | Query and update assigned ticket status |
| **CLIENT** | Service client | Create tickets and query own history |

### Business Validations

**Tickets:** Cannot be created without valid category or client  
**Technicians:** Maximum 5 "in progress" tickets simultaneously  
**States:** Only valid changes: Open → In Progress → Resolved → Closed  
**DTOs:** Validation with class-validator on all fields  
**Guards:** Role-based access control on each endpoint  
**Constraints:** Referential integrity in the database

---

## Test Data (Seeders)

The project includes seeders that generate realistic data using **Faker**:

```bash
# Populate database
npm run seed
```

**Test users created:**

| Email | Password | Role |
|-------|------------|-----|
| admin@techhelpdesk.com | Admin123! | ADMIN |
| tech@techhelpdesk.com | Tech123! | TECHNICIAN |
| client@techhelpdesk.com | Client123! | CLIENT |

**Generated data:**
- 5 users (admin, technicians, clients)
- 3 incident categories
- 10 clients with fictional companies
- 5 technicians with specialties
- 20 sample tickets with different statuses

---

## Docker Deployment

### Configuration Files

- `Dockerfile` - Optimized multi-stage image (Node 20 Alpine)
- `docker-compose.yml` - NestJS container orchestration
- `.dockerignore` - Exclusions to optimize build

### Useful Docker Commands

```bash
# Build and start container
docker-compose up -d --build

# View logs in real-time
docker logs tech-help-desk-app -f

# View container status
docker ps | grep tech-help

# Access container shell
docker exec -it tech-help-desk-app sh

# Stop services
docker-compose down

# Restart application
docker restart tech-help-desk-app

# View environment variables
docker exec tech-help-desk-app env
```

### Verify Operation

```bash
# Test that API responds
curl http://localhost:3004/api/docs

# Verify database connection
docker logs tech-help-desk-app | grep "Database connected"
```

---

## Technologies Used

| Technology | Version | Purpose |
|-----------|---------|-----------|
| **NestJS** | 11.1.9 | Progressive backend framework |
| **TypeORM** | 0.3.28 | ORM for PostgreSQL |
| **PostgreSQL** | 14+ | Relational database |
| **JWT** | 11.0.2 | Stateless authentication |
| **Passport** | 0.7.0 | Authentication middleware |
| **Swagger** | 11.2.3 | Automatic API documentation |
| **class-validator** | 0.14.3 | DTO validation |
| **class-transformer** | 0.5.1 | Object transformation |
| **bcrypt** | 6.0.0 | Secure password hashing |
| **Jest** | 29.7.0 | Testing framework |
| **Faker** | 10.1.0 | Test data generation |
| **Docker** | Latest | Containerization and deployment |

---

## Available NPM Scripts

```bash
# Development
npm run start:dev       # Start with hot-reload
npm run start:debug     # Start with debugger

# Production
npm run build           # Compile TypeScript
npm run start:prod      # Start production mode

# Testing
npm run test            # Run unit tests
npm run test:cov        # Tests with coverage
npm run test:watch      # Tests in watch mode
npm run test:e2e        # End-to-end tests

# Database
npm run seed            # Populate DB with test data

# Code quality
npm run lint            # ESLint
npm run format          # Prettier
```

---

## Completed Deliverables

**GitHub Repository:** https://github.com/angelicacvo/techHelpDesk  
**Complete README.md** with detailed instructions  
**Swagger URL:** http://localhost:3004/api/docs  
**.env.example file** with all necessary variables  
**Dockerfile and docker-compose.yml** for deployment  
**Seeders with initial data** using Faker  
**76 unit tests** with Jest (coverage >56%)  
**Swagger documentation** of all endpoints  
**SOLID principles** applied throughout the code

---

## License

UNLICENSED - Educational project for Riwi

---

## Developer

**Angelica Correa Villegas**  
**Clan:** Musa  
**GitHub:** [@angelicacvo](https://github.com/angelicacvo)  
**Email:** angiemarin0707@gmail.com

---

## Acknowledgments

Project developed as performance test for the **Node.js with NestJS and TypeORM** module at Riwi.

---

Happy Coding!
