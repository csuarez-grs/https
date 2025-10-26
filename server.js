const express = require('express');
const helmet = require('helmet');
const app = express();
const path = require('path');

const fs = require('fs');

const postsRouter = require('./Routes/posts');

app.use(helmet());

// Middleware for caching and static files
app.use('/static', express.static(path.join(__dirname, 'static'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
        if (path.endsWith('.js') || path.endsWith('.css')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
        if (path.endsWith('.jpg') || path.endsWith('.png')) {
            res.set('Cache-Control', 'max-age=2592000'); // Cache images for 30 days
        }
    }
}));

// Create http server
const http = require('http');
const http_port = 3000;
const server = http.createServer(app);

// Use posts router
app.use('/posts', postsRouter);

app.get("/page", (req, res) => {
    const message = req.query.msg || 'This is not secure!';
    res.sendFile(path.join(__dirname, "static", "index.html"));
});

app.get('/', (req, res) => {
    console.log('Received request for root');
    const message = req.query.msg || 'This is not secure!';

    html = insertMessage(message);

    res.send(html);
});

function insertMessage(message) {
    const filePath = path.join(__dirname, 'static', 'index.html');
    let html = fs.readFileSync(filePath, 'utf8');
    html = html.replace('{{message}}', message);

    return html;
}

server.on('error', (err) => {
    console.error('Error starting HTTP server:', err);
});

http.createServer(app).listen(http_port, () => {
    console.log(`HTTP server is running on http://localhost:${http_port}`);
});

// Create https server
const https = require('https');
const https_port = 3001;
const https_app = express();
const options = {
    key: fs.readFileSync(path.join(__dirname, '/cert/private-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert/certificate.pem'))
};

// Use posts router
https_app.use('/posts', postsRouter);

// Security middleware with Helmet and CSP
https_app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "cdn.example.com"],
      },
    },
    referrerPolicy: { policy: "no-referrer" },
    crossOriginEmbedderPolicy: false, // disable for compatibility (e.g. with iframes)
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    xFrameOptions: { action: "deny" },
  })
);

// Rate limiting middleware for DDoS protection and cache control
https_app.use('/static', express.static(path.join(__dirname, 'static'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
        if (path.endsWith('.js') || path.endsWith('.css')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
        if (path.endsWith('.jpg') || path.endsWith('.png')) {
            res.set('Cache-Control', 'max-age=2592000'); // Cache images for 30 days
        }
    }
}));

https_app.get('/', (req, res) => {
    console.log('Received request for /secure');
    const message = req.query.msg || 'This is a secure website!';

    html = insertMessage(message);

    res.send(html);
});

const httpsServer = https.createServer(options, https_app);
httpsServer.on('error', (err) => {
    console.error('Error starting HTTPS server:', err);
});

httpsServer.listen(https_port, () => {
    console.log(`HTTPS server is running on https://localhost:${https_port}`);
});