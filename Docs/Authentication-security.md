# SecureVault — Authentication Security

## Objective:
Implement secure user registration with input validation, password hashing, and MongoDB Atlas persistence.

## Technologies Used:
- Node.js and Express.js
- MongoDB Atlas and Mongoose
- bcryptjs
- Helmet
- express-rate-limit

## Security Controls Implemented:
### 1. Password Hashing
User passwords are hashed using bcrypt with a cost factor of 12 before being stored in MongoDB. Plaintext passwords are not stored.

### 2. Input Validation
The registration endpoint validates required fields, email format, and password length before creating an account.

### 3. Duplicate Account Protection
The application checks for existing email addresses and handles duplicate-key database errors.

### 4. Role-Based Account Creation
Newly registered users receive the default `user` role. Public registration requests cannot assign administrative privileges.

### 5. Database Least Privilege
The application uses a dedicated MongoDB account with `readWrite` permissions restricted to the `securevault` database.

### 6. API Protection
Helmet security headers, JSON request-size limits, and API rate limiting are enabled.

## Registration Endpoint
**Method:** POST
**Endpoint:** `/api/auth/register`
**Expected success status:** HTTP 201

## Test Evidence:
- [Successful User Registration](../Screenshots/Screenshot-of-user-registration-success.png)
- [bcrypt Password Hashing](../Screenshots/Screenshot-of-bcrypt-password-hashing.png)

## JWT Authentication and Protected Routes

### Implementation:
SecureVault implements JWT-based authentication using the `jsonwebtoken` library.
- JWT signing algorithm: HS256
- Token expiration: 15 minutes
- Token issuer: `securevault`
- Token identity claim: User ID (`sub`)
- Signing secret: Stored privately in environment variables

### Authentication Middleware: The `middleware/auth.js` component:
1. Extracts the Bearer token from the Authorization header.
2. Verifies the JWT signature, issuer, and expiration.
3. Checks that the associated user still exists in MongoDB.
4. Retrieves the user's current role from the database.
5. Rejects invalid or missing credentials.

### Protected Endpoint:
`GET /api/auth/me`

Only requests with a valid JWT can access this endpoint.

### Security Test Results:
Test : Expected Result
 1. JWT generation after successful login : Token issued
 2. Request without JWT : HTTP 401
 3. Request with valid JWT : HTTP 200
 4. Request with tampered JWT : HTTP 401

### Evidence:
- [JWT Generation](/Screenshots/Screenshot-of-jwt-token-generated.png)
- [Unauthorized Access Blocked](/Screenshots/Screenshot-of-unauthorized-token-generated.png)
- [Valid JWT Access](/Screenshots/Screenshot-of-login-success.png)
- [Tampered JWT Rejected](/Screenshots/Screenshot-of-tampered-jwt-rejected.png)

### Security Limitations:
JWT authentication currently uses short-lived bearer tokens. Refresh-token rotation, token revocation, HTTPS deployment, and additional automated security testing remain future improvements.

## Current Limitations

- Login functionality is not yet implemented.
- Authentication tokens and protected routes are planned.
- Additional validation, abuse protection, and automated security tests will be added in later milestones.
