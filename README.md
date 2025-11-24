## Secure User Dashboard & Profile Updates

This document captures the current implementation for the dashboard, profile update workflow, and supporting security measures, along with developer setup steps and reflections from this phase.

### Part A: User Dashboard
- Displays a personalized welcome message plus user name and email pulled from the authenticated session.
- Shows a placeholder section reserved for the upcoming profile update form.
- Provides a Logout button that ends the user session.
- Guards all dashboard data so only the logged-in user sees their own information.

### Part B: Secure User Profile Update Form
- Fields: Name, Email, Bio.
- Validation rules:
  - Name: 3–50 alphabetic characters.
  - Email: RFC-style email format.
  - Bio: Max 500 characters, disallow HTML tags and special characters.
- Sanitization: trim/normalize, strip tags, reject unexpected fields; use helpers such as `express-validator` or `validator`.
- Output encoding: escape values when rendering (e.g., templating engine auto-escaping or `escape-html`) to prevent XSS.
- Encryption: encrypt sensitive fields (email, bio) with `crypto` before persistence; decrypt only when needed. Passwords remain hashed with Argon2.
- Transport security: use HTTPS so credentials and encrypted fields stay protected in transit.

### Part C: Dependency Hygiene
- Run `npm audit` routinely to surface vulnerable packages.
- Use GitHub Actions to automate security checks and dependency update alerts; review release notes before upgrading.

### Part D: Testing & Debugging Security
- XSS: attempt to inject scripts via name/email/bio and confirm sanitization + encoding block execution.
- Injection: probe APIs with SQL-like payloads and ensure ORM/query layers reject or parameterize inputs.
- Verify dashboard only returns the authenticated user’s data.

### Part E: Developer README

#### Cloning & Setup
1. Clone: `git clone <repo-url>` then `cd <project>`.
2. Install dependencies:
   - Backend: `cd backend && npm install`
   - Frontend: `cd ../frontend && npm install`
3. Configure environment:
   - Backend `.env`: DB connection, JWT secret, encryption key/IV for profile fields, OAuth credentials.
   - Frontend `.env`: API base URL and any client IDs as needed.
4. Run:
   - Backend: `npm run start` (defaults to port 2022).
   - Frontend: `npm run dev` (defaults to port 5173).
5. Visit the frontend URL and confirm it can reach the backend API.

#### Input Validation Techniques
- Server-side validation on every mutation route; reject requests with invalid or unexpected fields.
- Enforce length/format rules (name 3–50 alpha, email format, bio length 500) and strip HTML/special characters from bio.
- Use libraries such as `express-validator`/`validator` for consistent validation + sanitization; log and return generic errors to avoid information leaks.

#### Output Encoding Methods
- Rely on templating engine auto-escaping or explicit `escape-html` when injecting user data into views.
- Return JSON with safe strings; never reflect unsanitized input in errors.
- Set `Content-Type` headers explicitly to guide client interpretation.

#### Encryption Techniques Used
- Passwords: hashed with Argon2 (memory-hard, per-password salt).
- Profile fields: encrypt email and bio with `crypto` (symmetric key), store ciphertext; decrypt only for authorized reads.
- Tokens/cookies: JWTs signed and stored in HttpOnly, Secure, SameSite cookies.
- Transport: enforce HTTPS in production to protect credentials and encrypted payloads in flight.

#### Third-Party Libraries Dependency Management
- Track versions via `package-lock.json`; pin major versions and upgrade intentionally.
- Run `npm audit` and CI checks; review changelogs before bumping libraries like Passport, Argon2, or validation helpers.
- Use GitHub Actions to automate audits and report/update PRs; test updates before merging.

#### Lessons Learned & Reflections
- Input validation gaps can lead to XSS, injection, and storage of malicious payloads; strict validation plus sanitization is essential.
- Output encoding stops reflected/stored XSS by ensuring user data is rendered as text, not executable markup.
- Encryption challenges: key management and choosing modes; resolved by centralizing keys in env vars and using vetted algorithms with IVs.
- Outdated dependencies increase exploit risk; automation helps surface issues quickly but still requires human review to avoid breaking changes.
- Most challenging issues were balancing strict validation with user experience and ensuring encrypted fields remain searchable only where acceptable; further improvements could include automated security scanning in CI and fuzz testing of inputs.
