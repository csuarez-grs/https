# Secure Node.js HTTPS Server – Wellness Tracker

Carlos Suarez 000939679  |  Web Security Fundamentals (CPRG-312-A)  |  IDD - SATD – SAIT Fall 2025

## PHASE 1 – ESTABLISHING A SECURE HTTPS SERVER

### Part A: Application Overview
**Wellness Tracker**
A Node.js and Express-based app for tracking mindfulness practices, goals, and moods. Designed for flexibility and user customization.

---

### Setup Instructions
1. **Clone the repository**
   ```powershell
   git clone <repo-url>
   cd https
   ```
2. **Install dependencies**
   ```powershell
   npm install
   ```
3. **Generate SSL certificates**
   - Use OpenSSL to create `certificate.pem` and `private-key.pem` in the `cert/` folder:
     ```powershell
     openssl req -nodes -new -x509 -keyout cert/private-key.pem -out cert/certificate.pem
     ```
4. **Start the server**
   ```powershell
   node server.js
   ```
5. **Access endpoints**
   - HTTP: `http://localhost:3000/`
   - HTTPS: `https://localhost:3001/`

---

### SSL Configuration
- **OpenSSL** was chosen for manual control and compatibility with Node.js.
- Certificates are stored locally in the `cert/` directory.
- **Security headers** are enforced using [Helmet](https://helmetjs.github.io/):
  - Content Security Policy (CSP)
  - Referrer Policy
  - X-Frame-Options
  - Cross-Origin policies

---

### Caching Strategies
| Route           | Cache Policy                                      | Security Consideration                  |
|-----------------|--------------------------------------------------|-----------------------------------------|
| GET /posts      | public, max-age=300, stale-while-revalidate=300  | Only public (non-sensitive) data cached |
| GET /posts/:id  | public, max-age=300 (if public)                  | Role-based access for sensitive posts   |
| Static files    | HTML: no-cache; JS/CSS: 1 year; Images: 30 days  | No sensitive data in static assets      |

---

### Lessons Learned
- **SSL Setup:** OpenSSL offers flexibility but requires careful manual configuration. Automated SSL is easier but less customizable.
- **Security Headers:** Helmet simplifies the implementation of best-practice HTTP headers, but CSP rules must be tailored for app needs.
- **Caching:** Balancing performance and security is key. Only public data is cached; sensitive data requires role-based access and is never cached.
- **Route Design:** RESTful routes were implemented for posts, with clear separation of public and private data. Role checks are enforced for sensitive endpoints.
- **Trade-offs:** Manual SSL and custom headers provide control but increase setup complexity. Caching improves speed but must be used cautiously to avoid exposing sensitive data.

---

### Contact
Carlos Suarez

---
