# Node.js HTTP & HTTPS Server

This project demonstrates a simple Express server running both HTTP and HTTPS protocols as part of the second assignment at .
https://learn.sait.ca/d2l/home/801062

## Setting up the repository
Clone this repository from: https://github.com/csuarez-grs/https

1. Install dependencies:
   ```powershell
   npm install
   ```
2. Place your SSL certificates in the `cert/` folder (`certificate.pem` and `private-key.pem`).
3. Start the server:
   ```powershell
   node server.js
   ```

## Features
- HTTP server on port 3000
- HTTPS server on port 3001 (using self-signed certificates)
- Serves static HTML files for each protocol

## Endpoints
- `http://localhost:3000/` — Unsecure HTTP
- `https://localhost:3001/` — Secure HTTPS

## Notes
- Requires Node.js and npm.
- For development/testing only. Use valid certificates in production.
- This is for educational purposes only as part of the course Web Securty CPRG-312-A

