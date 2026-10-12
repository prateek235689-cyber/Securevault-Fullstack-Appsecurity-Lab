# SecureVault — Role-Based Access Control (RBAC)

## 1. Objective:
Implement secure, server-side Role-Based Access Control (RBAC) to restrict access to administrative API endpoints based on authenticated users' assigned roles.

The implementation follows the principle of least privilege, ensuring that regular users cannot access administrative functionality even when they possess a valid JSON Web Token (JWT).

## 2. Security Architecture:
SecureVault uses two separate security layers to protect sensitive API endpoints.

### Layer 1: Authentication:
**Middleware:** `backend/middleware/auth.js`

- Extracts the JWT from the Authorization header.
- Verifies the token's signature, expiration, algorithm, and issuer.
- Retrieves the authenticated user from MongoDB.
- Attaches the user's current ID, email, and role to the request.
- Rejects missing, invalid, or expired authentication tokens.

### Layer 2: Authorization:
**Middleware:** `backend/middleware/authorize.js`

- Checks whether the request has an authenticated user.
- Compares the user's assigned role against the endpoint's permitted roles.
- Returns HTTP 403 Forbidden when the user lacks the required permissions.
- Allows the request to continue only when the user's role is authorized.

**Access control flow:**:
Client Request → JWT Verification → MongoDB User Lookup → Role Verification → Protected API Endpoint

## 3. Supported User Roles

| Role | Permissions |
|---|---|
| `user` | Access standard authenticated endpoints |
| `admin` | Access standard authenticated endpoints and admin-only endpoints |

All newly registered accounts receive the `user` role by default.

Administrative privileges are not assignable through the public registration endpoint.

For this lab, a dedicated test account was manually assigned the `admin` role through MongoDB Atlas to verify authorized administrative access.

## 4. Protected API Endpoints:
| HTTP Method | Endpoint | Required Access |
|---|---|---|
| GET | `/api/auth/me` | Valid JWT |
| GET | `/api/auth/admin` | Valid JWT + `admin` role |

### Admin-Only Endpoint

The `/api/auth/admin` endpoint applies authentication and authorization middleware in sequence.

```javascript
router.get(
    "/admin",
    authenticate,
    authorize("admin"),
    (req, res) => {
        return res.status(200).json({
            message: "Admin access granted",
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role
            }
        });
    }
);
```

Only authenticated users with the `admin` role can access this endpoint.

## 5. Implementation Files:
| File | Purpose |
|---|---|
| `backend/models/User.js` | Defines the user schema and permitted roles |
| `backend/middleware/auth.js` | Verifies JWTs and retrieves authenticated users |
| `backend/middleware/authorize.js` | Enforces role-based authorization |
| `backend/routes/auth.js` | Defines protected user and admin API routes |

### Security Design Decisions:
- Authentication and authorization are implemented as separate middleware.
- User permissions are enforced on the backend.
- The current user role is retrieved from MongoDB instead of trusting a client-provided role.
- Public registration assigns the least-privileged `user` role.
- Administrative routes require both successful authentication and the appropriate role.
- Unauthorized requests receive appropriate HTTP error responses.

## 6. RBAC Security Testing:
Three authorization scenarios were tested using PowerShell HTTP requests against the local SecureVault backend.

### Test Case 1 — Regular User Access Denied
**Endpoint:** `GET /api/auth/admin`
**Test:** Attempt to access the admin-only endpoint using a valid JWT belonging to a regular user.
**Expected HTTP Status:** `403 Forbidden`
**Actual Result:** `403 Forbidden`
**Status:** PASSED

This confirms that successful authentication does not automatically grant administrative privileges.

### Test Case 2 — Authorized Admin Access Granted
**Endpoint:** `GET /api/auth/admin`
**Test:** Access the admin-only endpoint using a valid JWT belonging to the dedicated administrator test account.
**Expected HTTP Status:** `200 OK`
**Actual Result:** `200 OK`
**Status:** PASSED

The endpoint successfully recognizes the administrator role and permits access.

### Test Case 3 — Unauthenticated Access Blocked
**Endpoint:** `GET /api/auth/admin`
**Test:** Send an HTTP request without an Authorization header or JWT.
**Expected HTTP Status:** `401 Unauthorized`
**Actual Result:** `401 Unauthorized`
**Status:** PASSED

This confirms that unauthenticated requests cannot access the administrative endpoint.

## 7. Security Test Summary:
| Test Case | Expected Status | Actual Status | Result |
|---|---|---|---|
| Regular user accesses admin endpoint | 403 | 403 | PASSED |
| Authorized admin accesses admin endpoint | 200 | 200 | PASSED |
| Request without JWT accesses admin endpoint | 401 | 401 | PASSED |

**Overall Result:** All three RBAC security test scenarios passed.

## 8. Security Testing Evidence:
The following screenshots provide evidence of the implemented authorization controls.

### Evidence 1 — Authorized Admin Access (HTTP 200)
[📸 Click Here to View Admin Access Granted Screenshot](/Screenshots/Screenshot-of-RBAC-user-access-granted.png)

![Admin Access Granted — HTTP 200](/Screenshots/Screenshot-of-admin-access-granted.png)

**Observation:** The admin-only endpoint returns HTTP 200 for an authenticated user assigned the `admin` role.

### Evidence 2 — Unauthenticated Access Blocked (HTTP 401)
[📸 Click Here to View Unauthenticated Access Blocked Screenshot](/Screenshots/Screenshot-of-no-token-blocked.png)

![Unauthenticated Access Blocked — HTTP 401](/Screenshots/Screenshot-of-no-token-blocked.png)

**Observation:** The admin-only endpoint rejects requests without a JWT.


## 9. Security Controls Demonstrated:
The RBAC implementation demonstrates the following application security controls:
- **Role-Based Access Control:** Permissions are restricted according to assigned user roles.
- **Least Privilege:** New accounts receive regular-user permissions by default.
- **Server-Side Authorization:** Permissions are checked by backend middleware.
- **Authentication Enforcement:** Protected endpoints reject requests without valid authentication.
- **Administrative Access Restriction:** Regular users cannot access admin-only endpoints.
- **Separation of Responsibilities:** Authentication and authorization are implemented independently.
- **HTTP Security Responses:** Requests return 401, 403, or 200 depending on authentication and authorization outcomes.

## 10. Security Considerations and Future Improvements:
The current implementation establishes foundational RBAC controls. Further improvements will include:

- Enforcing document-level ownership and authorization checks.
- Testing horizontal and vertical privilege escalation attempts.
- Preventing unauthorized modification or deletion of another user's resources.
- Adding automated authorization tests.
- Implementing controlled administrator provisioning and audit logging.
- Performing additional application security testing and documenting remediation evidence.

## 11. Conclusion:
SecureVault successfully implements and tests server-side Role-Based Access Control for its protected administrative API endpoint.

The completed tests demonstrate that:
- Regular authenticated users are denied administrative access.
- Authorized administrators can access restricted functionality.
- Unauthenticated requests are rejected.

The implementation establishes a foundation for secure resource-level authorization, future vulnerability testing, and remediation within the SecureVault Full-Stack Application Security Lab.

**Milestone Status: RBAC Implementation and Initial Security Testing Completed.**
