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

## Current Limitations

- Login functionality is not yet implemented.
- Authentication tokens and protected routes are planned.
- Additional validation, abuse protection, and automated security tests will be added in later milestones.
