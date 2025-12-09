# Swagger Usage Guide - TechHelpDesk API

## Documentation Access

Once the application is running, access the interactive documentation at:

```
http://localhost:3004/api/docs
```

## How to Use Swagger

### 1. Authentication

To test protected endpoints, you must first authenticate:

#### Step 1: Login
1. Find the `POST /auth/login` endpoint in the **auth** section
2. Click "Try it out"
3. Enter credentials:

**Admin User:**
```json
{
  "email": "admin@techhelpdesk.com",
  "password": "Admin123!"
}
```

**Technician User:**
```json
{
  "email": "tecnico@techhelpdesk.com",
  "password": "Tech123!"
}
```

**Client User:**
```json
{
  "email": "cliente@techhelpdesk.com",
  "password": "Client123!"
}
```

4. Click "Execute"
5. **Copy the `access_token`** from the response

#### Step 2: Authorize
1. Click the **"Authorize"** button (green padlock in the top right)
2. Paste the token in the "Value" field
3. Click "Authorize" and then "Close"

Now you can test all protected endpoints.

---

## Main Endpoints

### AUTH - Authentication

#### POST /auth/register
Registers a new user in the system.

**Request Example:**
```json
{
  "name": "Pedro Gomez",
  "email": "pedro.gomez@example.com",
  "password": "Password123!",
  "role": "CLIENT"
}
```

**Available roles:** `ADMIN`, `TECHNICIAN`, `CLIENT`

#### POST /auth/login
Logs in and obtains a JWT token.

**Request Example:**
```json
{
  "email": "admin@techhelpdesk.com",
  "password": "Admin123!"
}
```

#### GET /auth/profile
Gets the authenticated user's profile (requires token).

---

### USERS - User Management (ADMIN only)

#### POST /users
Creates a new user (administrators only).

**Example:**
```json
{
  "name": "Ana Lopez",
  "email": "ana.lopez@example.com",
  "password": "SecurePass123!",
  "role": "TECHNICIAN"
}
```

#### GET /users
Lists all system users.

#### GET /users/:id
Gets a specific user by ID.

#### PATCH /users/:id
Updates user data.

#### DELETE /users/:id
Deletes a user from the system.

---

### CATEGORIES - Category Management

#### POST /categories (ADMIN only)
Creates a new ticket category.

**Example:**
```json
{
  "name": "Network Incident",
  "description": "Issues related to network connectivity"
}
```

#### GET /categories
Lists all available categories.

#### GET /categories/:id
Gets a specific category.

#### PATCH /categories/:id (ADMIN only)
Updates an existing category.

#### DELETE /categories/:id (ADMIN only)
Deletes a category.

---

### CLIENTS - Client Management

#### POST /clients (ADMIN only)
Creates a new client profile.

**Example:**
```json
{
  "name": "Roberto Sanchez",
  "contactEmail": "roberto@company.com",
  "company": "Tech Corp S.A.",
  "userId": "user-uuid-with-client-role"
}
```

#### GET /clients
Lists all clients.

#### GET /clients/:id
Gets a specific client.

#### PATCH /clients/:id
Updates client data.

#### DELETE /clients/:id
Deletes a client.

---

### TECHNICIANS - Technician Management

#### POST /technicians (ADMIN only)
Creates a new technician profile.

**Example:**
```json
{
  "specialty": "Hardware Support",
  "availability": true,
  "userId": "user-uuid-with-technician-role"
}
```

#### GET /technicians
Lists all technicians.

#### GET /technicians/:id
Gets a specific technician.

#### PATCH /technicians/:id
Updates technician data.

#### DELETE /technicians/:id
Deletes a technician.

---

### TICKETS - Ticket Management

#### POST /tickets
Creates a new support ticket.

**Example:**
```json
{
  "title": "Third floor printer not working",
  "description": "The HP LaserJet printer in office 305 won't print, showing paper jam error",
  "priority": "HIGH",
  "categoryId": "category-uuid",
  "clientId": "client-uuid",
  "technicianId": "technician-uuid"
}
```

**Priorities:** `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`

#### GET /tickets
Lists all tickets (ADMIN sees all, TECHNICIAN sees assigned, CLIENT sees own).

#### GET /tickets/:id
Gets a specific ticket.

#### GET /tickets/client/:clientId
Gets all tickets for a specific client.

#### GET /tickets/technician/:technicianId
Gets all tickets assigned to a technician.

#### PATCH /tickets/:id/status
Updates ticket status.

**Example:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Available statuses:** `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`

**Transition rules:**
- `OPEN` -> `IN_PROGRESS`
- `IN_PROGRESS` -> `RESOLVED`
- `RESOLVED` -> `CLOSED`

**Note:** A technician cannot have more than 5 tickets in `IN_PROGRESS` status simultaneously.

#### PATCH /tickets/:id
Updates ticket information (title, description, priority).

#### DELETE /tickets/:id
Deletes a ticket.

---

## Recommended Workflow

### 1. Create Users and Profiles
1. Login as ADMIN
2. Create users with `POST /users`
3. Create client profiles with `POST /clients`
4. Create technician profiles with `POST /technicians`

### 2. Configure Categories
1. Create categories with `POST /categories`
2. Example: "Hardware", "Software", "Network", "General Inquiry"

### 3. Manage Tickets
1. Login as CLIENT
2. Create ticket with `POST /tickets`
3. Login as TECHNICIAN
4. View assigned tickets with `GET /tickets/technician/:id`
5. Update status with `PATCH /tickets/:id/status`

---

## Response Codes

- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid data
- **401 Unauthorized**: Not authenticated (missing or invalid token)
- **403 Forbidden**: Not authorized (insufficient role)
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## Response Format

All responses follow the standardized format:

**Success:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Request processed successfully"
}
```

**Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/endpoint",
  "method": "POST",
  "message": "Error description",
  "error": "Bad Request"
}
```

---

## Usage Tips

1. **Always authenticate first** before testing protected endpoints
2. **Copy UUIDs** from responses to use in other endpoints
3. **Review examples** in each endpoint before sending requests
4. **Validate required roles** for each operation
5. **Use the "Try it out" button** to test interactively

---

## Support

For more information about the API, consult the project's README.md.
