## Description

FHn GIS Assessment — Registration API

This repository contains a NestJS application implementing the teacher-student registration and notification API for the assessment.

Base URL prefix: `/api/v1` (configured in `src/main.ts`).

Implemented endpoints:

- POST /api/register — register one or more students to a teacher (returns 204)
- GET /api/commonstudents?teacher=teacher@example.com[&teacher=other@example.com] — returns common students (200)
- POST /api/suspend — suspend a student (returns 204)
- POST /api/retrievefornotifications — get notification recipients (returns 200)

See `src/registration` for controller, service, and DTOs.

Local setup:

1. Provide env var pointing to a MySQL instance.

## FHn GIS Assessment — Registration & Notifications API

This repository is a NestJS application that implements a teacher / student registration and notification system used for the assessment. It includes domain models for teachers, students, subjects and classes and endpoints for registering students, suspending students, retrieving recipients for notifications, and listing historical notifications.

Base URL prefix: `/api/v1` (see `src/main.ts`).

---

Quick project summary

- Framework: NestJS (TypeScript)
- ORM: TypeORM (MySQL driver)
- Testing: Jest
- Caching: NestJS CacheModule (in-memory by default; optional Redis recommended for production)

Project layout (important files/folders)

- `src/registration` — controller, service, DTOs for the API surface
- `src/db/entities` — TypeORM entities (Student, Teacher, Subject, Class, WhitelistDomain, Notification)
- `src/db/migrations` — migration scripts (when present)
- `src/main.ts` and `src/app.module.ts` — app bootstrap and module wiring

---

API Endpoints
All endpoints are prefixed with `/api/v1`.

- POST /api/v1/register

  - Request body: { teacher: string, students: string[] }

- GET /api/v1/commonstudents?teacher=teacher1@x.com&teacher=teacher2@y.com

  - Returns intersection of students assigned to the listed teacher(s).

- POST /api/v1/suspend

  - Request body: { student: string }
  - Suspends the student (preventing notification deliveries).

- POST /api/v1/retrievefornotifications

  - Request body: { teacher: string, notification: string }
  - Returns list of recipients: students taught by the teacher (who are not suspended) plus any @mentioned emails in the notification text (if they exist and are not suspended). The call also stores a historical Notification record (for auditing) — stored recipients, text and timestamp.

- GET /api/v1/notifications?teacher=teacher@x.com&page=1&size=20
  - Returns paginated historical notifications for a teacher (items, total, page, size). Useful for audits and monitoring.

See `src/registration/*.ts` for DTO shapes and behavior.

Concurrency and capacity

- Class registration enforces capacity and uses transactional operations to avoid race conditions when multiple clients try to register students into the same class concurrently. See `RegistrationService` for implementation details (uses TypeORM transactions and row-level locks).

---

Configuration & Environment variables
Create a `.env` file (or set env vars) with these keys:

- MySQL / TypeORM

  - MYSQL_HOST, MYSQL_DB_PORT (or MYSQL_PORT), MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
  - TypeORM is configured in `src/app.module.ts` (autoLoadEntities: true). For production, use migrations instead of `synchronize`.

- App
  - PORT (default 5000)
  - NODE_ENV (production|development)

---

Database migrations & seeding

- The project supports TypeORM migrations. To generate a migration (when entities change):

```bash
npm run migration:generate -- -n <migrationName>
```

- To run migrations:

```bash
npm run migration:run
```

- You can seed initial data with the seeder script (if present):

```bash
npm run seed:run
```

---

Docker

- Build image:

```bash
docker build -t fhn_gis_assessment:latest .
```

- Run with docker-compose (MySQL + app):

```bash
docker-compose up --build
```

Notes: the included `docker-compose.yml` starts a MySQL service and the app. For production, prefer building the image and not mounting the full source tree into the container.

---

Testing

- Unit tests use Jest. Run:

```bash
npm ci
npm run test
```
