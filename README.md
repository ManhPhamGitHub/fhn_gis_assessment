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

1. Provide `DATABASE_URL` env var pointing to a MySQL instance.
2. Install deps and build:

```
npm ci
npx tsc -p tsconfig.build.json
```

3. Start:

```
npm run start:dev
```

If you'd like, I can add migrations, seeds, validation decorators, and tests next.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

