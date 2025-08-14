# Collaborative Task Management System

A full-stack real-time task management application with user authentication, reminders, and live updates. Built with **Spring Boot** on the backend and **React + TypeScript** on the frontend.

---

## Tech Stack

### Backend (Java Spring Boot)
- Spring Boot 3
- Spring Security (JWT-based Auth)
- PostgreSQL
- Hibernate / JPA
- WebSockets
- Maven

### Frontend (React + TypeScript)
- React 18
- Vite
- Axios
- React Router
- Context API for auth state
- TailwindCSS (if used)

---

## Features

- **Secure Login/Register** with JWT
- **Create, Edit, Delete Tasks**
- **Real-Time WebSocket Sync**
- **Reminders** with due date & time
- **Priority & Labels** for task organization
- **Modular and Scalable Architecture**
- **Axios Hook Integration** for clean API calls

---

## Local Development

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL running locally
- Docker (optional for PostgreSQL)

---

### 🔙 Backend

```bash
cd server
./mvnw spring-boot:run
