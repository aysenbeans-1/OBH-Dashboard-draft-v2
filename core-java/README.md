# Java Spring Boot API Middleware

This is a high-performance Java Spring Boot middleware component designed to sit in front of the API architecture. 

It handles:
1. **Authentication**: Stateless validation of JWT tokens on incoming requests.
2. **Authorization**: Fine-grained role-based access control (RBAC) utilizing `@PreAuthorize` (e.g. `ROLE_ADMIN` vs `ROLE_USER`).
3. **Request Validation**: Automatic schema enforcement and data hygiene validation using JSR-380 validation annotations (such as `@NotBlank`, `@Pattern`, `@Size`) before requests are forwarded downstream.

---

## Architectural Role

```
   [ Client / React UI ] 
             │
             ▼
┌──────────────────────────┐
│ Java Spring Boot Gateway │  <-- Port 8080 (Auth, Validation, Authz)
└────────────┬─────────────┘
             │ (Proxy Forwarding)
             ▼
┌──────────────────────────┐
│  Node/Express API Server │  <-- Port 3000 (Business Logic & Database)
└──────────────────────────┘
```

---

## Prerequisites
- Java Development Kit (JDK) 17 or higher
- Apache Maven 3.8+

## How to Build
To build the executable JAR, run:
```bash
mvn clean package
```

## How to Run
To run the Spring Boot application, use:
```bash
java -jar target/middleware-1.0.0.jar
```
Or use the Spring Boot Maven plugin:
```bash
mvn spring-boot:run
```

---

## Configuration

Settings are maintained in `src/main/resources/application.properties`:
- `server.port`: Configured to `8080` (or another gateway port of choice).
- `app.jwt.secret`: Symmetric key for verifying incoming authorization signatures.
- `target.backend.url`: Downstream REST endpoint of your main Node/Express application server (`http://localhost:3000`).
