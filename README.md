
### HU-14: Docker Deployment (Extra)
**As** a DevOps  
**I want** to containerize the application  
**So that** deployment is facilitated

**Acceptance criteria:**
- Functional Dockerfile for the API
- docker-compose.yml with API and PostgreSQL
- Persistent volume for the database
- Configured environment variables

**Tasks:**
- Create multi-stage Dockerfile
- Create docker-compose.yml
- Configure networking between containers
- Document deployment commands

---

# Techo help desk: technical support

## Technical Requirements

### Technology Stack
- **Framework:** NestJS
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Documentation:** Swagger
- **Testing:** Jest
- **Validation:** class-validator, class-transformer

### SOLID Principles
The code must implement:
- **S**ingle Responsibility Principle
- **O**pen/Closed Principle
- **L**iskov Substitution Principle
- **I**nterface Segregation Principle
- **D**ependency Inversion Principle

---

## Installation and Configuration

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v14 or higher)
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/angelicacvo/techHelpDesk.git
cd tech-help-desk

# Install dependencies
npm install
```

### Environment Variables Configuration

Create a `.env` file in the project root:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=tech_help_desk

# JWT
JWT_SECRET=your_secure_secret_key
JWT_EXPIRES_IN=1d

# Application
PORT=3000
NODE_ENV=development
```

### Migrations and Seeders

```bash
# Run migrations
npm run migration:run

# Run seeders
npm run seed
```

---

## Running the Project

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### With Docker
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## API Documentation

Once the server is started, access the interactive Swagger documentation:

**URL:** http://localhost:3000/api/docs

### Main Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - Login

#### Users
- `GET /users` - List users (Admin)
- `POST /users` - Create user (Admin)
- `PATCH /users/:id` - Update user (Admin)
- `DELETE /users/:id` - Delete user (Admin)

#### Categories
- `GET /categories` - List categories
- `POST /categories` - Create category (Admin)
- `PATCH /categories/:id` - Update category (Admin)
- `DELETE /categories/:id` - Delete category (Admin)

#### Tickets
- `POST /tickets` - Create ticket (Client, Admin)
- `GET /tickets` - List all tickets (Admin)
- `GET /tickets/:id` - Query specific ticket
- `GET /tickets/client/:id` - History by client
- `GET /tickets/technician/:id` - Tickets by technician
- `PATCH /tickets/:id/status` - Update status (Technician, Admin)
- `PATCH /tickets/:id/assign` - Assign technician (Admin)

#### Clients
- `GET /clients` - List clients (Admin)
- `POST /clients` - Create client (Admin)

#### Technicians
- `GET /technicians` - List technicians (Admin)
- `POST /technicians` - Create technician (Admin)

---

## Testing

### Run Unit Tests
```bash
npm run test
```

### Run Tests with Coverage
```bash
npm run test:cov
```

### Run e2e Tests
```bash
npm run test:e2e
```

---

## Database

### Database Dump
The SQL file with initial data is located at: `/database/dump.sql`

### Restore Database
```bash
psql -U postgres -d tech_help_desk < database/dump.sql
```

---

## Project Structure

```
src/
├── auth/               # Authentication module
├── users/              # Users module
├── categories/         # Categories module
├── tickets/            # Tickets module
├── clients/            # Clients module
├── technicians/        # Technicians module
├── common/             # Shared utilities
│   ├── decorators/     # Custom decorators
│   ├── guards/         # Custom guards
│   ├── interceptors/   # Interceptors
│   ├── filters/        # Exception filters
│   └── pipes/          # Custom pipes
├── database/           # DB configuration and seeders
└── main.ts             # Entry file
```

---

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit the changes (`git commit -m 'feat: add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## License

This project is under the MIT License.

---

## Resources

- [Official NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Swagger for Nest Documentation](https://docs.nestjs.com/openapi/introduction)
- [Jest Documentation](https://jestjs.io/)
- [Docker Documentation](https://docs.docker.com/)

---

## Contact

**Angélica María Cuervo Marín**  
GitHub: [@angelicacvo](https://github.com/angelicacvo)  
Email: [angiemarin0707@gmail.com]
