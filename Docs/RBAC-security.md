# SecureVault — Role-Based Access Control (RBAC)

## Objective:
Implement server-side role-based access control to prevent unauthorized users from accessing administrative endpoints.

## Security Architecture:
SecureVault implements two layers of access protection:
 1. **Authentication:** JWT middleware verifies the Bearer token and retrieves the authenticated user from MongoDB.
 2. **Authorization:** RBAC middleware checks the authenticated user's role against the roles permitted for the endpoint.

## Supported Roles:
| Role | Access |
 1. `user` : Standard authenticated endpoints
 2. `admin` : Standard authenticated endpoints and admin-only endpoints

## Protected API Endpoints:
| Method | Endpoint | Protection |

 1. GET : `/api/auth/me` : Valid JWT required
 2. GET : `/api/auth/admin` : Valid JWT and admin role required |

## Implementation:
- Authentication middleware: `backend/middleware/auth.js`
- Authorization middleware: `backend/middleware/authorize.js`
- Protected routes: `backend/routes/auth.js`
- User roles stored in MongoDB using an allowlist of `user` and `admin`
- Role permissions checked server-side against the current database user record
- Public registration assigns the `user` role by default

## Security Test Results:
| Test Case | Expected HTTP Status | Result |

 1. Regular user accesses admin endpoint | 403 Forbidden | Passed |
 2. Admin accesses admin endpoint | 200 OK | Passed |
 3. Unauthenticated request accesses admin endpoint | 401 Unauthorized | Passed |

## Security Controls Demonstrated:
- Prevention of unauthorized administrative access
- Separation of authentication and authorization
- Server-side enforcement of user permissions
- Default least-privilege account registration
- Rejection of unauthenticated requests
- Rejection of authenticated users with insufficient permissions

## Evidence:
- `Screenshots/Screenshot-of-RBAC-user-access`
- `screenshots/14-admin-no-token-blocked.png`

## Conclusion:
SecureVault's RBAC implementation enforces role-based restrictions on protected API endpoints. The tested scenarios demonstrate that authenticated regular users are denied administrative access, authorized administrators are permitted, and unauthenticated requests are rejected.
These tests validate the implemented RBAC controls for the covered scenarios; additional authorization testing will be performed as more application features are developed.
