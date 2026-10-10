# SecureVault — Project Scope

## Application Purpose:
SecureVault is a locally hosted document management application used to demonstrate secure application development and vulnerability remediation.

## Planned Features:
- User registration and login
- User-specific document records
- Document creation, viewing, editing, and deletion
- Role-based authorization
- Protected REST APIs
- Security event logging

## Security Objectives:
- Prevent unauthorized access to user documents.
- Protect authentication credentials.
- Enforce authorization on every protected API operation.
- Validate untrusted inputs.
- Reduce exposure to common web application vulnerabilities.
- Verify remediations using repeatable security tests.

## Assessment Scope:
 1. In scope : Secure Vault frontend, backend, API endpoints, authentication flows, and locally controlled test data.
 2. Out of scope : Third-party websites, production systems, and infrastructure without explicit testing authorization.

## Testing Methodology:
 1. Security assessment will follow relevant OWASP Web Security Testing Guide techniques.
 2. Findings will be recorded with supporting evidence, severity justification, remediation steps, and retesting results.

## Current Status:
Project planning and repository setup.
