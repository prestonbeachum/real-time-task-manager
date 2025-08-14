# Collaborative Task Management System

A full-stack, real-time task management app designed for productivity, clean architecture, and team collaboration. Built with Spring Boot and React (TypeScript), it supports authentication, WebSocket updates, reminders, and modular expansion.

---

## Tech Stack

**Backend (Spring Boot 3 + Java):**
- Spring Boot
- Spring Security (JWT Auth)
- PostgreSQL
- WebSockets
- JPA / Hibernate
- Maven

**Frontend (React + TypeScript):**
- React 18 (w/ Vite)
- React Router
- Axios (custom hook)
- Context API (for auth state)
- TailwindCSS (optional)

---

## Features

- JWT-based authentication (Login/Register)
- Create, update, delete tasks
- User-based task visibility
- Real-time WebSocket updates
- Due dates & reminders
- Labels, priority levels, filtering
- Centralized error logging
- Modular and scalable project structure

---

## Project Structure

collab-task-manager/
├── client/ # React frontend
│ ├── src/
│ └── public/
├── server/ # Spring Boot backend
│ ├── src/
│ └── pom.xml

yaml
Copy
Edit

---

## Local Setup

### Prerequisites

- Java 21+
- Node.js 18+
- PostgreSQL installed & running locally

---

### Backend

```bash
cd server
./mvnw spring-boot:run
Update your application.properties as needed:
