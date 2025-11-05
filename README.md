
## Secure Authentication & Authorization System

### Part A: Design a Secure Authentication System

This application implements robust authentication using both local (username/password) and single sign-on (SSO) via Google. Passwords are hashed with Argon2 before storage. The system supports password resets and forgotten passwords (see `/auth/reset`). SSO is integrated using Passport.js with Google as the provider for ease of use and security.

**Reflection:**
We chose local authentication for flexibility and Google SSO for convenience and security. Google is widely trusted and familiar to users, reducing the complexity. 

In the past experience we saw how the SSO increases adoption and reduces password fatigue, while local auth is essential for users without third-party accounts.

---

### Part B: Control Access with Role-Based Permissions

Users are assigned roles: `User` and `Admin`. Roles are stored in the database and included in JWTs. Middleware restricts access to protected routes:
- `/admin`: Admin only
- `/profile`: Authenticated users
- `/dashboard`: All logged users, with features based on role

**Reflection:**
Access control is enforced via middleware and route guards. We kept the role system simple for clarity and maintainability. The main challenge was balancing security with usability—ensuring admins have full control while regular users are not hindered. Middleware and route guards provide a seamless experience.

---

### Part C: Implement JSON Web Tokens (JWT)

JWTs are generated on login and stored in HttpOnly cookies for security. Tokens expire after 1 hour, and a refresh system is planned for session continuity. Middleware validates JWTs for protected routes, and expired tokens prompt re-authentication.

**Reflection:**
HttpOnly cookies were chosen for token storage to prevent XSS attacks. The main challenge was balancing session duration with security; 1-hour expiry is a good compromise. Middleware ensures only valid tokens grant access, and refresh logic can be added for longer sessions.

---

### Part D: Mitigate Security Risks

Session cookies use Secure, HttpOnly, and SameSite attributes. Sessions expire after 1 hour. CSRF protection is implemented via middleware, and rate limiting prevents brute-force attacks. Session fixation is mitigated by regenerating session IDs after login. Account enumeration is prevented by generic error messages.

**Reflection:**
We identified risks like CSRF, session fixation, and brute-force attacks. Mitigations include secure cookies, CSRF middleware, and rate limiting. The challenge was maintaining usability while enforcing security—generic errors and session timeouts help balance this.

---

### Part E: Test and Debug Security

Authentication and authorization are tested via unit and integration tests. Penetration testing is performed to simulate attacks. All authentication methods (local and SSO) are verified, and only authorized users can access restricted routes.

**Reflection:**
Testing included manual and automated approaches. Vulnerabilities were prioritized by severity and impact. Issues found during testing were resolved by tightening middleware and improving error handling.

---

### Part F: Document Your Solution

#### Setting Up the Repository
1. Clone the repository
2. Run `npm install` in both backend and frontend folders
3. Start backend: `npm run start` (port 2022)
4. Start frontend: `npm run dev` (port 5173)

#### Authentication Mechanisms
- Local authentication: username/email + password
- SSO: Google OAuth via Passport.js
- Passwords hashed with Argon2
- JWT stored in HttpOnly cookies

#### Role-Based Access Control
- Roles: User, Admin
- Role stored in DB and JWT
- Middleware restricts access to protected routes

#### Lessons Learned
Balancing security and usability is challenging. SSO improves user experience, but local auth is necessary for flexibility. Middleware and secure cookies are essential for robust protection. Testing and error handling are critical for a secure system.

#### Demo Video
- Shows login/logout
- Protected routes and role-based access
- JWT authentication in action
