# SOA Node.js Template

This repository provides a template for building a Service-Oriented Architecture (SOA) based Node.js application. The template includes essential features like authentication, role-based access control (RBAC), logging, caching, and more. This template is designed to help you quickly set up a robust and scalable backend for your projects.

## Features

- **Service-Oriented Architecture (SOA)**: Modular design with separate services for user management, role management, and logging.
- **Role-Based Access Control (RBAC)**: Define and manage user roles and permissions easily.
- **Authentication**: JWT-based authentication with support for access tokens and refresh tokens.
- **Logging**: Integrated logging with Winston and MongoDB.
- **Caching**: Simple caching mechanism using a custom cache service.
- **Error Handling**: Centralized error handling and logging.
- **Security**: Basic security measures including authentication middleware and permission checks.

## Getting Started

### Prerequisites

- Node.js v20.14.0 or later
- MongoDB instance (local or cloud-based)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/devburak/soa-node-template.git
    cd soa-node-template
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Environment Variables**:
    Create a `.env` file in the root directory and add the following environment variables:
    ```plaintext
    DB_URI=mongodb+srv://username:password@cluster0.mongodb.net/soa-node-template
    JWT_SECRET=your_jwt_secret
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    APPURL=http://localhost:3000
    EMAIL_FROM=...
    EMAIL_SERVICE=
    EMAIL_USER=
    EMAIL_PASS= 
    TEAM_NAME= used into Email template
    ```

4. **Run the seed script** to create default roles and an admin user:
    ```bash
    node seed.js
    ```

### Running the Application

Start the development server:
```bash
npm run dev
```
### API Endpoints
### User Service
```js
POST /api/users/login: User login
POST /api/users/refresh-token: Refresh access token
GET /api/users: Get all users (requires readUsers permission)
GET /api/users/ : Get user by ID (requires readUser permission)
POST /api/users: Create a new user (requires createUser permission)
PUT /api/users/ : Update user by ID (requires updateUser permission)
DELETE /api/users/ : Delete user by ID (requires deleteUser permission)
POST /api/users/request-password-reset: Request password reset
POST /api/users/reset-password/ : Reset password 
```
#### Role Service
```
GET /api/roles: Get all roles
POST /api/roles: Create a new role
PUT /api/roles/ : Update role by ID
DELETE /api/roles/ : Delete role by ID
```
#### Log Service
```
GET /api/logs : Get all logs
GET /api/logs/:id : Get log by ID
DELETE /api/logs/ : Delete log by ID
```