# Perfume Ecommerce

Full-stack perfume ecommerce application built with Spring Boot and React.

## Tech Stack

- Backend: Spring Boot, Spring Data JPA, Spring Security, PostgreSQL, Flyway, GraphQL, WebSocket
- Frontend: React, TypeScript, Redux Toolkit, Ant Design
- Auth: JWT, OAuth2 Google/Facebook/GitHub, reCAPTCHA
- Storage: MinIO/S3-compatible object storage
- Build: Maven, npm

## Features

- JWT authentication and email activation
- OAuth2 login with Google, Facebook, or GitHub
- Product search and filtering
- Cart and checkout flow
- User profile and order history
- Admin product, user, and order management
- REST and GraphQL APIs

## Backend Setup

1. Install Java 8, Maven, Docker, and Docker Compose.
2. Start the backend stack with `docker compose up -d`.
3. Configure runtime values with environment variables or edit local-only config outside version control.
4. Run the backend with `./mvnw spring-boot:run`.

Main config lives in `src/main/resources/application.yml`. Test overrides live in `src/test/resources/application-test.yml`.

Common environment variables:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `STORAGE_S3_ENDPOINT`
- `STORAGE_S3_PUBLIC_URL`
- `STORAGE_S3_ACCESS_KEY`
- `STORAGE_S3_SECRET_KEY`
- `STORAGE_S3_REGION`
- `STORAGE_S3_BUCKET_NAME`
- `STORAGE_S3_PATH_STYLE_ACCESS`
- `RECAPTCHA_SECRET`
- `JWT_SECRET`
- `APP_FRONTEND_BASE_URL`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

## Frontend Setup

1. Open `frontend`.
2. Configure `.env` values such as `REACT_APP_API_BASE_URL` and `REACT_APP_RECAPTCHA_SITE_KEY`.
3. Run `npm install` if dependencies are missing.
4. Run `npm start`.

## Useful Commands

- Backend compile: `./mvnw clean compile`
- Backend tests: `./mvnw test`
- Frontend start: `npm start` from `frontend`
- Frontend build: `npm run build` from `frontend`

## API Docs

- Local Swagger UI: `http://localhost:8080/swagger-ui.html`
- Local backend base URL: `http://localhost:8080`
