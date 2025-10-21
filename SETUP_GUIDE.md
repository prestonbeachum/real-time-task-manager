# Collaborative Task Manager - Setup and Run Guide

## Overview
This is a full-stack task management application with:
- **Backend**: Spring Boot 3.4.5 + PostgreSQL + JWT Authentication
- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS

## Prerequisites
- Java 21+
- Node.js 18+
- Docker & Docker Compose
- Maven (included via Maven Wrapper)

## Quick Start

### 1. Start PostgreSQL Database
```bash
# Start PostgreSQL in Docker
docker-compose up -d

# Verify database is running
docker-compose ps
```

### 2. Start Backend Server
```bash
# Navigate to server directory
cd server

# Install dependencies and run
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Start Frontend
```bash
# In a new terminal, navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Testing the Application

### 1. Register a New User
- Navigate to `http://localhost:5173/signup`
- Fill in username, email, and password
- Click "Create Account"

### 2. Login
- Navigate to `http://localhost:5173/login`
- Enter your username and password
- Click "Login"
- You'll receive a JWT token and be redirected to the dashboard

### 3. Manage Tasks
- Add new tasks with title, description, label, priority, due date, and reminder
- Edit task titles by clicking on them
- Delete tasks using the Delete button
- All tasks are automatically associated with your user account

## Architecture Overview

### Backend Structure
```
server/
├── config/
│   └── SecurityConfig.java          # JWT + CORS configuration
├── controller/
│   ├── LoginController.java         # Handles login, returns JWT token
│   ├── UserRegistrationController.java  # User signup
│   ├── TaskController.java          # CRUD operations for tasks
│   └── ...
├── model/
│   ├── User.java                    # User entity
│   └── Task.java                    # Task entity
├── repository/
│   ├── UserRepository.java
│   └── TaskRepository.java
├── security/
│   ├── CustomUserDetailsService.java    # Spring Security integration
│   └── JwtAuthenticationFilter.java     # JWT token validation
├── service/
│   ├── UserService.java
│   └── TaskService.java
└── util/
    └── JwtUtil.java                 # JWT token generation/validation
```

### Frontend Structure
```
client/
├── src/
│   ├── api/
│   │   ├── axios.ts                # Axios instance with JWT interceptor
│   │   ├── api.ts                  # API helper functions
│   │   └── auth.ts                 # Authentication functions
│   ├── pages/
│   │   ├── Login.tsx               # Login page
│   │   ├── Signup.tsx              # Registration page
│   │   └── Dashboard.tsx           # Main task management
│   └── App.tsx                     # Routing
```

## Key Features Implemented

### Authentication & Security
✅ JWT-based authentication (10-hour token validity)
✅ Secure password hashing with BCrypt
✅ CORS configuration for frontend-backend communication
✅ Automatic token refresh handling
✅ Protected routes on frontend and backend

### Task Management
✅ Create, read, update, delete tasks
✅ Task fields: title, description, label, priority, due date, reminder time
✅ User-specific task isolation
✅ Real-time updates

### Database
✅ PostgreSQL with Docker Compose
✅ JPA/Hibernate for ORM
✅ Automatic schema generation
✅ User and Task entities with relationships

## Configuration Files

### Database Connection
File: `server/src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/taskdb
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### Frontend API Endpoint
File: `client/src/api/axios.ts`
```typescript
baseURL: "http://localhost:8080"
```

## Common Issues & Solutions

### Issue: Database connection refused
**Solution**: Make sure PostgreSQL is running via Docker:
```bash
docker-compose up -d
docker-compose logs db
```

### Issue: Port 8080 already in use
**Solution**: Stop other applications using port 8080 or change the port in `application.properties`:
```properties
server.port=8081
```

### Issue: Port 5173 already in use
**Solution**: Vite will automatically try the next available port, or specify one in `vite.config.ts`

### Issue: CORS errors
**Solution**: Verify that `SecurityConfig.java` has the correct frontend URL:
```java
config.setAllowedOrigins(List.of("http://localhost:5173"));
```

### Issue: JWT token expired
**Solution**: Tokens are valid for 10 hours. Simply log in again to get a new token.

## API Endpoints

### Public Endpoints
- `POST /register` - Register new user
- `POST /login` - Login and get JWT token
- `GET /ping` - Health check

### Protected Endpoints (Require JWT Token)
- `GET /tasks` - Get all tasks for current user
- `POST /tasks` - Create new task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

## Development Tips

### Backend Development
- Use `./mvnw spring-boot:run` for hot reload
- Check logs in console for errors
- Database schema updates automatically with `spring.jpa.hibernate.ddl-auto=update`

### Frontend Development
- Vite provides instant HMR (Hot Module Replacement)
- Check browser console for errors
- JWT token is stored in localStorage

### Debugging
- Backend logs: Check terminal running Spring Boot
- Frontend logs: Check browser Developer Console
- Database: Use any PostgreSQL client to connect to `localhost:5432/taskdb`

## Next Steps

### Potential Enhancements
- [ ] WebSocket support for real-time collaboration
- [ ] Email notifications for reminders
- [ ] Task sharing between users
- [ ] Task filtering and search
- [ ] File attachments
- [ ] Task comments and activity log
- [ ] Mobile responsive improvements
- [ ] Dark mode

## Technology Stack

### Backend
- Spring Boot 3.4.5
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- JWT (io.jsonwebtoken)
- Lombok

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- TailwindCSS

### DevOps
- Docker & Docker Compose
- Maven

## License
MIT

## Support
For issues or questions, please check the logs and ensure all services are running correctly.
