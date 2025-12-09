# TechHelpDesk - Sistema de Soporte Técnico

**Desarrollado por:** Angélica Cuervo  
**Clan:** [Tu Clan]

## Descripción

API REST desarrollada con NestJS, TypeORM, JWT y Swagger para la administración integral del ciclo de vida de tickets de soporte técnico. El sistema permite gestionar usuarios con roles diferenciados, crear y asignar tickets, controlar estados y categorías de incidencias, y consultar el historial completo.

---

## Épica: Sistema de Gestión de Tickets de Soporte Técnico

### Contexto
La empresa TechHelpDesk ofrece servicios de soporte técnico para organizaciones que manejan múltiples equipos de trabajo. Actualmente, las solicitudes de soporte (tickets) se registran manualmente a través de hojas de cálculo, generando retrasos en la atención, pérdida de trazabilidad y duplicidad de reportes.

### Objetivo
Construir una API REST que permita administrar todo el ciclo de vida de los tickets de soporte técnico con autenticación, autorización por roles, validaciones robustas y documentación completa.

---

## Historias de Usuario

### HU-01: Sistema de Autenticación y Roles
**Como** usuario del sistema  
**Quiero** registrarme e iniciar sesión con JWT  
**Para** acceder a las funcionalidades según mi rol

**Criterios de aceptación:**
- Implementación de autenticación mediante JWT
- Guards personalizados para controlar acceso según el rol
- Roles: Administrador, Técnico, Cliente
- Decorators personalizados (@Roles(), @CurrentUser())
- Hash seguro de contraseñas

**Tareas:**
- Crear módulo Auth con registro y login
- Implementar JwtStrategy y Guards
- Crear decoradores personalizados @Roles() y @CurrentUser()
- Proteger endpoints según roles

---

### HU-02: Persistencia de Datos con TypeORM
**Como** desarrollador  
**Quiero** modelar las entidades del sistema con TypeORM  
**Para** garantizar integridad referencial y relaciones correctas

**Criterios de aceptación:**
- Base de datos relacional PostgreSQL
- Entidades: User, Category, Ticket, Client, Technician
- Relaciones correctamente definidas con constraints
- Migraciones configuradas

**Tareas:**
- Crear entidad User (id, name, email, password, role)
- Crear entidad Category (id, name, description)
- Crear entidad Ticket (id, title, description, status, priority, createdAt, updatedAt)
- Crear entidad Client (id, name, company, contactEmail)
- Crear entidad Technician (id, name, specialty, availability)
- Definir relaciones entre tickets, técnicos y clientes con constraints

---

### HU-03: Gestión de Usuarios (CRUD)
**Como** administrador  
**Quiero** gestionar usuarios del sistema  
**Para** controlar el acceso y roles

**Criterios de aceptación:**
- CRUD completo de usuarios accesible solo a Administradores
- Endpoints protegidos: GET /users, POST /users, PATCH /users/:id, DELETE /users/:id
- Validación de DTOs con class-validator
- Documentación en Swagger

**Tareas:**
- Crear módulo Users con controlador y servicio
- Implementar DTOs: CreateUserDto, UpdateUserDto
- Aplicar guards de rol @Roles('ADMIN')
- Documentar endpoints en Swagger

---

### HU-04: Gestión de Categorías (CRUD)
**Como** administrador  
**Quiero** gestionar categorías de incidencias  
**Para** clasificar correctamente los tickets

**Criterios de aceptación:**
- CRUD completo accesible solo a Administradores
- Categorías: Solicitud, Incidente de Hardware, Incidente de Software
- Seeders con categorías iniciales
- Validación de categoría válida al crear tickets

**Tareas:**
- Crear módulo Categories
- Implementar endpoints CRUD
- Crear seeders con categorías predefinidas
- Validar referencias en tickets

---

### HU-05: Gestión de Clientes y Técnicos
**Como** administrador  
**Quiero** gestionar clientes y técnicos  
**Para** asignarlos correctamente a los tickets

**Criterios de aceptación:**
- CRUD de clientes (name, company, contactEmail)
- CRUD de técnicos (name, specialty, availability)
- Seeders con datos iniciales
- Relación correcta con entidad User

**Tareas:**
- Crear módulos Clients y Technicians
- Implementar CRUDs completos
- Crear seeders con datos de prueba
- Validar relaciones con User

---

### HU-06: Creación de Tickets
**Como** cliente  
**Quiero** crear tickets de soporte  
**Para** reportar incidencias

**Criterios de aceptación:**
- Endpoint POST /tickets protegido
- Validación de cliente y categoría obligatorios
- No permitir creación sin categoría ni cliente válido
- Estado inicial: "Abierto"
- Pipes de validación con class-validator

**Tareas:**
- Crear endpoint POST /tickets
- Implementar CreateTicketDto con validaciones
- Validar cliente y categoría existen en BD
- Aplicar guards según rol (Cliente, Admin)

---

### HU-07: Asignación y Actualización de Estado
**Como** técnico o administrador  
**Quiero** actualizar el estado de tickets asignados  
**Para** reflejar el progreso de resolución

**Criterios de aceptación:**
- Endpoint PATCH /tickets/:id/status con guards
- Validación de secuencia: Abierto → En progreso → Resuelto → Cerrado
- Técnico no puede tener más de 5 tickets "en progreso"
- Solo técnicos asignados y admins pueden cambiar estado

**Tareas:**
- Crear endpoint PATCH /tickets/:id/status
- Implementar validación de secuencia de estados
- Validar límite de 5 tickets en progreso por técnico
- Aplicar guards de rol

---

### HU-08: Consulta de Historial de Tickets
**Como** cliente o técnico  
**Quiero** consultar el historial de tickets  
**Para** dar seguimiento a mis solicitudes o asignaciones

**Criterios de aceptación:**
- Endpoint GET /tickets/client/:id (historial por cliente)
- Endpoint GET /tickets/technician/:id (tickets por técnico)
- Endpoint GET /tickets/:id (consulta individual)
- Decoradores @Param('id')
- Clientes solo ven sus tickets, técnicos sus asignados, admins todo

**Tareas:**
- Implementar GET /tickets/client/:id
- Implementar GET /tickets/technician/:id
- Implementar GET /tickets/:id
- Aplicar filtros y permisos según rol

---

### HU-09: Validaciones y Pipes
**Como** desarrollador  
**Quiero** implementar validaciones robustas  
**Para** garantizar integridad de datos

**Criterios de aceptación:**
- DTOs con class-validator en todos los campos obligatorios
- ValidationPipe global configurado
- ExceptionFilter personalizado para errores HTTP
- Manejo consistente de excepciones

**Tareas:**
- Aplicar decoradores de class-validator en DTOs
- Configurar ValidationPipe global
- Crear ExceptionFilter personalizado
- Documentar errores en Swagger

---

### HU-10: Interceptor de Formateo de Respuestas
**Como** consumidor de la API  
**Quiero** recibir respuestas en formato estándar  
**Para** facilitar el manejo de datos

**Criterios de aceptación:**
- TransformInterceptor implementado
- Formato: { success, data, message }
- Aplicación global del interceptor

**Tareas:**
- Crear TransformInterceptor
- Aplicar globalmente en main.ts
- Formatear todas las respuestas consistentemente

---

### HU-11: Documentación con Swagger
**Como** desarrollador frontend  
**Quiero** tener documentación interactiva de la API  
**Para** integrarme fácilmente

**Criterios de aceptación:**
- Swagger configurado en /api/docs
- Todos los endpoints documentados con ejemplos
- DTOs documentados con @ApiProperty
- Autenticación JWT documentada con @ApiBearerAuth

**Tareas:**
- Configurar módulo Swagger
- Documentar todos los endpoints con decoradores
- Incluir ejemplos de request y response
- Documentar esquemas de autenticación

---

### HU-12: Seeders Iniciales
**Como** desarrollador  
**Quiero** poblar la base de datos con datos iniciales  
**Para** probar el sistema rápidamente

**Criterios de aceptación:**
- Seeders de usuarios, técnicos, clientes
- Seeders de categorías de incidencias
- Comando npm run seed funcional

**Tareas:**
- Crear script de seeding
- Poblar usuarios con roles
- Poblar categorías predefinidas
- Poblar clientes y técnicos de prueba

---

### HU-13: Pruebas Unitarias con Jest
**Como** desarrollador  
**Quiero** implementar pruebas unitarias  
**Para** garantizar la calidad del código

**Criterios de aceptación:**
- Prueba unitaria para creación de tickets
- Prueba unitaria para cambio de estado
- Cobertura mínima del 40% (npm run test:cov)

**Tareas:**
- Crear test para TicketsService.create()
- Crear test para TicketsService.updateStatus()
- Configurar mocks de repositorios
- Ejecutar npm run test:cov y validar cobertura

---

### HU-14: Despliegue con Docker (Extra)
**Como** DevOps  
**Quiero** contenerizar la aplicación  
**Para** facilitar el despliegue

**Criterios de aceptación:**
- Dockerfile funcional para la API
- docker-compose.yml con API y PostgreSQL
- Volumen persistente para la base de datos
- Variables de entorno configuradas

**Tareas:**
- Crear Dockerfile multi-stage
- Crear docker-compose.yml
- Configurar networking entre contenedores
- Documentar comandos de despliegue

---

## Requisitos Técnicos

### Stack Tecnológico
- **Framework:** NestJS
- **ORM:** TypeORM
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT
- **Documentación:** Swagger
- **Testing:** Jest
- **Validación:** class-validator, class-transformer

### Principios SOLID
El código debe implementar:
- **S**ingle Responsibility Principle
- **O**pen/Closed Principle
- **L**iskov Substitution Principle
- **I**nterface Segregation Principle
- **D**ependency Inversion Principle

---

## Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn
- PostgreSQL (v14 o superior)
- Docker (opcional)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/angelicacvo/techHelpDesk.git
cd tech-help-desk

# Instalar dependencias
npm install
```

### Configuración de Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_DATABASE=tech_help_desk

# JWT
JWT_SECRET=tu_secret_key_segura
JWT_EXPIRES_IN=1d

# Application
PORT=3000
NODE_ENV=development
```

### Migraciones y Seeders

```bash
# Ejecutar migraciones
npm run migration:run

# Ejecutar seeders
npm run seed
```

---

## Ejecución del Proyecto

### Modo Desarrollo
```bash
npm run start:dev
```

### Modo Producción
```bash
npm run build
npm run start:prod
```

### Con Docker
```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

---

## Documentación de la API

Una vez iniciado el servidor, acceder a la documentación interactiva de Swagger:

**URL:** http://localhost:3000/api/docs

### Endpoints Principales

#### Autenticación
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión

#### Usuarios
- `GET /users` - Listar usuarios (Admin)
- `POST /users` - Crear usuario (Admin)
- `PATCH /users/:id` - Actualizar usuario (Admin)
- `DELETE /users/:id` - Eliminar usuario (Admin)

#### Categorías
- `GET /categories` - Listar categorías
- `POST /categories` - Crear categoría (Admin)
- `PATCH /categories/:id` - Actualizar categoría (Admin)
- `DELETE /categories/:id` - Eliminar categoría (Admin)

#### Tickets
- `POST /tickets` - Crear ticket (Cliente, Admin)
- `GET /tickets` - Listar todos los tickets (Admin)
- `GET /tickets/:id` - Consultar ticket específico
- `GET /tickets/client/:id` - Historial por cliente
- `GET /tickets/technician/:id` - Tickets por técnico
- `PATCH /tickets/:id/status` - Actualizar estado (Técnico, Admin)
- `PATCH /tickets/:id/assign` - Asignar técnico (Admin)

#### Clientes
- `GET /clients` - Listar clientes (Admin)
- `POST /clients` - Crear cliente (Admin)

#### Técnicos
- `GET /technicians` - Listar técnicos (Admin)
- `POST /technicians` - Crear técnico (Admin)

---

## Pruebas

### Ejecutar Pruebas Unitarias
```bash
npm run test
```

### Ejecutar Pruebas con Cobertura
```bash
npm run test:cov
```

### Ejecutar Pruebas e2e
```bash
npm run test:e2e
```

---

## Base de Datos

### Dump de la Base de Datos
El archivo SQL con los datos iniciales se encuentra en: `/database/dump.sql`

### Restaurar Base de Datos
```bash
psql -U postgres -d tech_help_desk < database/dump.sql
```

---

## Estructura del Proyecto

```
src/
├── auth/               # Módulo de autenticación
├── users/              # Módulo de usuarios
├── categories/         # Módulo de categorías
├── tickets/            # Módulo de tickets
├── clients/            # Módulo de clientes
├── technicians/        # Módulo de técnicos
├── common/             # Utilidades compartidas
│   ├── decorators/     # Decoradores personalizados
│   ├── guards/         # Guards personalizados
│   ├── interceptors/   # Interceptores
│   ├── filters/        # Exception filters
│   └── pipes/          # Pipes personalizados
├── database/           # Configuración de BD y seeders
└── main.ts             # Archivo de entrada
```

---

## Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

---

## Licencia

Este proyecto está bajo la Licencia MIT.

---

## Recursos

- [Documentación oficial de NestJS](https://docs.nestjs.com/)
- [Documentación de TypeORM](https://typeorm.io/)
- [Documentación de Swagger para Nest](https://docs.nestjs.com/openapi/introduction)
- [Documentación de Jest](https://jestjs.io/)
- [Documentación de Docker](https://docs.docker.com/)

---

## Contacto

**Angélica Velásquez**  
GitHub: [@angelicacvo](https://github.com/angelicacvo)  
Email: [tu-email@ejemplo.com]
