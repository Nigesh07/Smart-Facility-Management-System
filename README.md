# Smart Facility Management System — Backend

Spring Boot backend for the Smart Facility Management System.

## Tech Stack
Java 17, Spring Boot 3.2.5, Spring Web, Spring Data JPA, Spring Security, JWT (jjwt 0.12.5), BCrypt, PostgreSQL, Maven, Cloudinary.

## 1. Prerequisites
- JDK 17+
- Maven 3.8+
- PostgreSQL 13+ running locally (or remotely)
- A Cloudinary account (free tier is fine)

## 2. Database Setup
Create the database:
```sql
CREATE DATABASE smart_facility_db;
```
Tables are auto-created/updated on startup via `spring.jpa.hibernate.ddl-auto=update`.

## 3. Environment Variables
Set these before running (or edit `application.properties` directly):

| Variable | Purpose | Default |
|---|---|---|
| `DB_USERNAME` | Postgres username | postgres |
| `DB_PASSWORD` | Postgres password | postgres |
| `JWT_SECRET` | Base64 256-bit signing key | placeholder included — replace for production |
| `JWT_EXPIRATION_MS` | Token lifetime in ms | 86400000 (24h) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | — required |
| `CLOUDINARY_API_KEY` | Cloudinary API key | — required |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | — required |
| `CORS_ALLOWED_ORIGINS` | Frontend origin(s), comma-separated | http://localhost:5173 |
| `DEFAULT_ADMIN_EMAIL` | Seeded admin login | admin@smartfacility.com |
| `DEFAULT_ADMIN_PASSWORD` | Seeded admin password | Admin@123 |

## 4. Run
```bash
mvn clean install
mvn spring-boot:run
```
Server starts on `http://localhost:8080`.

On first run, the app seeds:
- 6 default categories (Electrical, Plumbing, IT Support, Cleaning, Transport, General Maintenance)
- 1 ADMIN account using `DEFAULT_ADMIN_EMAIL` / `DEFAULT_ADMIN_PASSWORD`

Log in as that admin, then create COORDINATOR, TECHNICIAN, and USER accounts from `POST /api/users`.

## 5. Project Structure
```
src/main/java/com/example/smartfacility
├── controller       REST endpoints (thin — delegate to services)
├── service           Interfaces
├── service/impl       Business logic
├── repository         Spring Data JPA repositories
├── model              JPA entities
├── dto/request        Inbound DTOs
├── dto/response        Outbound DTOs
├── enums               Role, Priority, TicketStatus, TechnicianSpecialization, NotificationType
├── security            JWT + Spring Security config
├── config              Cloudinary bean + startup data seeding
├── exception           Custom exceptions + global handler
└── SmartFacilityApplication.java
```

## 6. API Summary

**Auth**
- `POST /api/auth/login` — public

**Users (Admin)**
- `POST /api/users`, `GET /api/users`, `GET /api/users/{id}`, `PUT /api/users/{id}`
- `PUT /api/users/{id}/status`, `PUT /api/users/{id}/role`, `DELETE /api/users/{id}`
- `GET /api/users/technicians?specialization=` — Coordinator/Admin, lists technicians for assignment

**Profile (any authenticated user)**
- `GET /api/users/profile`, `PUT /api/users/profile`, `PUT /api/users/profile/password`

**Categories**
- `GET /api/categories` — active only, any authenticated user
- `GET /api/categories/all` — Admin, includes inactive
- `POST /api/categories`, `PUT /api/categories/{id}`, `PUT /api/categories/{id}/status`, `DELETE /api/categories/{id}` — Admin

**Tickets**
- `POST /api/tickets` — User
- `GET /api/tickets/my-tickets` — User
- `GET /api/tickets/coordinator` — Coordinator
- `GET /api/tickets/assigned` — Technician
- `GET /api/tickets` — Admin
- `GET /api/tickets/{id}` — any party to the ticket, or Admin/Coordinator
- `PUT /api/tickets/{id}/assign` — Coordinator
- `PUT /api/tickets/{id}/status` — Technician (starts work → IN_PROGRESS)
- `PUT /api/tickets/{id}/complete` — Technician
- `PUT /api/tickets/{id}/close` — Coordinator
- `GET /api/tickets/{id}/history` — authorized parties

**Notifications**
- `GET /api/notifications`, `GET /api/notifications/unread-count`
- `PUT /api/notifications/{id}/read`, `PUT /api/notifications/read-all`

**Uploads** (multipart/form-data, field name `file`)
- `POST /api/uploads/ticket-issue`
- `POST /api/uploads/ticket-completion`
- `POST /api/uploads/profile-image` (also updates the caller's profile)

## 7. Known Limitations / Next Steps
- This backend was built and reviewed in a sandbox without internet/Maven access, so it has **not** been compiled or run yet. Run `mvn clean install` locally first and fix any minor issues that surface (none are expected — every controller↔service↔repository call was manually cross-checked, but a real compile is the final confirmation).
- No automated tests included yet.
- No rate-limiting / refresh-token rotation — access tokens are long-lived (24h default); rotate `JWT_SECRET` and shorten expiry for production.
- Frontend (React) is not yet built — that's the next step.
