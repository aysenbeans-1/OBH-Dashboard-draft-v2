# OBH Dashboard & API Gateway Middleware

A comprehensive multi-tenant OTP Management and Message Routing platform featuring a modern React frontend, a Node.js/Express backend with MySQL database persistence, and an enterprise Java Spring Boot middleware gateway deployable as a WAR package to Apache Tomcat or WildFly.

---

## 📑 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [System Prerequisites](#-system-prerequisites)
- [Project Structure](#-project-structure)
- [1. Database Setup (MySQL)](#1-database-setup-mysql)
- [2. Running the Node.js / React Web Application](#2-running-the-nodejs--react-web-application)
- [3. Building & Deploying Java Middleware](#3-building--deploying-java-middleware)
  - [Building the WAR](#a-building-the-war-package)
  - [Deploying on Apache Tomcat 10.1+](#b-deploying-on-apache-tomcat-101)
  - [Deploying on WildFly 30+ / 41+](#c-deploying-on-wildfly-30--41)
  - [Running as Standalone Spring Boot](#d-running-standalone-without-external-app-server)
- [4. Default Credentials & Test Accounts](#4-default-credentials--test-accounts)
- [5. API Testing & Postman Guide](#5-api-testing--postman-guide)
- [6. Troubleshooting & Common Issues](#6-troubleshooting--common-issues)

---

## 🏛 Architecture Overview

```
                        [ Web Browser / Client UI ]
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
     (Direct API / UI Route)               (Gateway Proxy Route)
                    │                                 │
                    ▼                                 ▼
   ┌────────────────────────────────┐   ┌───────────────────────────────┐
   │    Node.js / Express Server    │   │  Java Spring Boot Middleware  │
   │    (Vite SPA + REST APIs)      │◄──┤  (WAR in Tomcat / WildFly)    │
   │          Port 3000             │   │          Port 8080            │
   └───────────────┬────────────────┘   └───────────────────────────────┘
                   │
                   ▼
   ┌────────────────────────────────┐
   │         MySQL Database         │
   │    (or In-Memory Fallback)     │
   │          Port 3306             │
   └────────────────────────────────┘
```

1. **Frontend**: React 19 single-page application built with Vite, Tailwind CSS, Lucide icons, and Motion animations.
2. **Core API Server**: Node.js & Express server handling business logic, 3-layer rolling JWT sessions, user profile syncing, tenant routing, and MySQL persistence (with automatic in-memory fallback for local sandboxes).
3. **Enterprise Middleware**: Java Spring Boot (WAR packaging) acting as an API gateway for token generation, payload validation (JSR-380), and reverse proxying to the Node backend.

---

## 📋 System Prerequisites

Ensure the following tools are installed on your machine before running the project:

| Tool | Recommended Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `v18.x` or `v20.x+` (with `npm`) | Runs Vite development server and Express API |
| **Java JDK** | `JDK 17` or `JDK 21` (LTS) | Compiles and executes the Spring Boot Java middleware |
| **Apache Maven** | `3.8.x` or `3.9.x+` | Builds the Java application and generates the `.war` package |
| **MySQL Server** | `8.0+` or MariaDB `10.5+` | Relational database storage |
| **Apache Tomcat** *(Optional)* | `10.1.x+` (Jakarta EE 10) | Servlet container for deploying `middleware.war` |
| **WildFly Application Server** *(Optional)* | `27+`, `30+`, or `41+` | Enterprise Jakarta EE application server |
| **Postman / cURL** *(Optional)* | Latest | For API testing and authorization verification |

---

## 📁 Project Structure

```
├── .env.example              # Environment variables template
├── db.js                     # MySQL connection pool & in-memory simulator fallback
├── package.json              # Node.js project manifest & scripts
├── schema.sql                # Complete MySQL DDL & seed data script
├── server.js                 # Express server & Vite integration entry point
├── src/                      # React frontend source code
│   ├── App.jsx               # Main React application & routing
│   ├── components/           # Reusable UI components (Layout, SessionManager)
│   └── pages/                # Page views (Admin, Customer, Tenant, Profiles, etc.)
├── core-java/                # Java Spring Boot API Gateway Middleware
│   ├── pom.xml               # Maven configuration (WAR packaging, Spring Boot 3)
│   ├── src/main/java/        # Spring Boot Java source code
│   │   └── com/obhdashboard/middleware/
│   │       ├── MiddlewareApplication.java # Spring Boot entry point & Servlet initializer
│   │       ├── config/       # Security & CORS configuration
│   │       ├── controller/   # AuthController & GatewayController
│   │       ├── dto/          # Data Transfer Objects & Validation
│   │       └── security/     # JWT Provider & Auth Filters
│   └── src/main/webapp/WEB-INF/
│       └── jboss-deployment-structure.xml # WildFly deployment descriptor
```

---

## 1. Database Setup (MySQL)

### Step 1: Start MySQL Server
Ensure your local MySQL service is running (via MySQL Workbench, XAMPP, Homebrew, or Docker).

### Step 2: Initialize Database & Seed Data
Execute the `schema.sql` script using MySQL CLI or your preferred GUI tool:

```bash
# Using MySQL Command Line Client:
mysql -u root -p < schema.sql
```

Alternatively, open `schema.sql` in MySQL Workbench or DBeaver and run all statements. This will:
- Create the database `obhdashboard`
- Create all tables: `users`, `user_sessions`, `companies`, `connections`, `tenants`, and `user_profiles`
- Insert initial admin and tenant user accounts with default configurations

---

## 2. Running the Node.js / React Web Application

### Step 1: Configure Environment Variables
Copy `.env.example` to a new `.env` file in the root directory:

```bash
cp .env.example .env
```

Open `.env` and fill in your MySQL database credentials:

```env
# Server Port (Runs on 3000)
PORT=3000

# MySQL Database Configuration
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD="your_mysql_password"
DB_NAME="obhdashboard"
DB_PORT="3306"

# Session Security Key
JWT_SECRET="obh_dashboard_jwt_secret_key_2026"
```

> **Note:** If MySQL credentials are left blank or unreachable, the application automatically activates an **in-memory simulation database**, allowing you to test all features without a local database.

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

Once started, open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 3. Building & Deploying Java Middleware

The Java middleware handles authentication token generation and secure proxying to the Node/Express backend.

### A. Building the WAR Package

1. Open a terminal and navigate to the `core-java` folder:
   ```bash
   cd core-java
   ```
2. Run Maven to compile and package the application:
   ```bash
   mvn clean package
   ```
3. Upon completion, the deployable WAR file will be located at:
   ```
   core-java/target/middleware.war
   ```

---

### B. Deploying on Apache Tomcat 10.1+

> **Important:** Spring Boot 3 utilizes **Jakarta EE 10** (`jakarta.servlet.*`). Always use **Apache Tomcat 10.1.x or newer** (do not use Tomcat 9, which uses legacy `javax.servlet.*`).

1. **Copy the WAR file**:
   Copy `core-java/target/middleware.war` into your Tomcat `webapps` folder:
   ```
   C:\Program Files\Apache Software Foundation\Tomcat 10.1\webapps\
   ```
2. **Permissions (Windows Users)**:
   If Tomcat is in `C:\Program Files\`, ensure you run Tomcat's startup as **Administrator**:
   - Right-click `bin/startup.bat` -> **Run as administrator**, or
   - Start the Tomcat service via `services.msc`
3. **Verify Deployment**:
   Tomcat will automatically extract `middleware.war` into a folder named `middleware`.
   - Access URL: `http://localhost:8080/middleware/api/auth/token`

---

### C. Deploying on WildFly 30+ / 41+

1. **Start WildFly**:
   ```bash
   # Windows:
   C:\wildfly-41.0.0\bin\standalone.bat

   # Linux / macOS:
   ./wildfly-41.0.0/bin/standalone.sh
   ```
2. **Access the Admin Console**:
   - Navigate to `http://localhost:9990`
   - *If you have not created an admin account yet*, run `bin/add-user.bat` (or `bin/add-user.sh`), choose `Management User`, and set a username/password.
3. **Deploy via Admin Console**:
   - Go to **Deployments** -> Click **Add** (`+`)
   - Select **Upload a new deployment** and choose `core-java/target/middleware.war`
   - Click **Next** -> Click **Finish** -> Click **Enable**
4. **Deploy via Filesystem (Alternative)**:
   - Copy `core-java/target/middleware.war` directly into `wildfly/standalone/deployments/`
   - Wait for `middleware.war.deployed` file to appear in the folder.
5. **Verify Deployment**:
   - Access URL: `http://localhost:8080/middleware/api/auth/token`

---

### D. Running Standalone (Without External App Server)

You can also run the Java middleware directly as a standalone Spring Boot application without Tomcat or WildFly:

```bash
cd core-java
mvn spring-boot:run
```
*The embedded server will start on port `8080` (endpoint: `http://localhost:8080/api/auth/token`).*

---

## 4. Default Credentials & Test Accounts

The following credentials are pre-seeded in the database and in-memory mock store:

| Role | Username | Password | Tenant / Organization | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | *All / System Wide* | Full access to Companies, Connections, Tenants & User Profiles |
| **Customer** | `dbs_user` | `dbs123` | DBS Bank (`dbs`) | Restricted to DBS Bank transactions & OTP deliveries |
| **Customer** | `uob_user` | `uob123` | UOB Bank (`uob`) | Restricted to UOB Bank transactions & OTP deliveries |
| **Customer** | `albert_tan` | `albert123` | DBS Bank (`dbs`) | Seeded user profile account |
| **Customer** | `beatrice_lim`| `beatrice123`| UOB Bank (`uob`) | Seeded user profile account |
| **Customer** | `charlie_sng` | `charlie123` | Singtel (`singtel`) | Seeded user profile account |

---

## 5. API Testing & Postman Guide

### 1. Generating Auth Token via Java Middleware
- **Method:** `POST`
- **URL:** `http://localhost:8080/middleware/api/auth/token` *(or `http://localhost:8080/api/auth/token` if standalone)*
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "username": "admin",
    "password": "password123",
    "role": "ROLE_ADMIN"
  }
  ```
- **Response:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "username": "admin",
    "role": "ROLE_ADMIN",
    "expiresIn": 86400000
  }
  ```

### 2. Forwarding Downstream Requests via Middleware Gateway
- **Method:** `POST`
- **URL:** `http://localhost:8080/middleware/api/gateway/forward`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <TOKEN_FROM_STEP_1>`
- **Body (JSON):**
  ```json
  {
    "path": "/api/companies",
    "method": "GET"
  }
  ```

### 3. Direct Node.js API Login
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "username": "admin",
    "password": "admin123",
    "role": "admin"
  }
  ```

---

## 6. Troubleshooting & Common Issues

### Issue 1: Tomcat returns `404 Not Found` for `/middleware`
- **Cause:** Tomcat failed to extract `middleware.war` due to missing write permissions or wrong Tomcat version.
- **Solution:**
  1. Ensure you are running **Tomcat 10.1.x+** (Tomcat 9 will fail to deploy Jakarta EE 10 packages).
  2. If Tomcat is installed in `C:\Program Files\`, right-click `startup.bat` and select **Run as administrator**.
  3. Inspect Tomcat logs in `<TOMCAT_HOME>/logs/catalina.out` or `<TOMCAT_HOME>/logs/localhost.<date>.log`.

### Issue 2: WildFly `LoggerFactory is not a Logback LoggerContext`
- **Cause:** Competing SLF4J / Logback implementations between Spring Boot and WildFly's JBoss LogManager.
- **Solution:** This has been resolved in the project configuration:
  - `spring-boot-starter-logging` is excluded in `core-java/pom.xml`.
  - `jboss-deployment-structure.xml` excludes WildFly's logging subsystem.
  - Re-run `mvn clean package` and re-deploy `middleware.war`.

### Issue 3: MySQL Connection Refused (`ECONNREFUSED 127.0.0.1:3306`)
- **Cause:** MySQL server is not running or credentials in `.env` are invalid.
- **Solution:** The server will automatically switch to **In-Memory Simulator Mode** so the UI remains completely functional. To connect to real MySQL, verify your service is active and update `.env`.

### Issue 4: Session Invalidation / Multiple Logins
- The application implements strict single-session concurrency per user. Logging in with the same username from a new browser or tab will automatically invalidate previous sessions.

---

## 🛠 Tech Stack Details

- **Frontend:** React 19, Tailwind CSS 4, React Router 7, Motion, Lucide Icons
- **Backend:** Node.js, Express, `mysql2`, `jsonwebtoken`, `dotenv`
- **Java Middleware:** Java 17, Spring Boot 3.2, Spring Security, JJWT, Jakarta Validation (Hibernate Validator)
- **Application Servers:** Apache Tomcat 10.1.x, Red Hat WildFly 30+ / 41+
- **Database:** MySQL 8.0+ / In-Memory Mock Store
