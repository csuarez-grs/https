const express = require('express');
const app = express();
const path = require('path');

const fs = require('fs');

// Create http server
const http = require('http');
const http_port = 3000;
const server = http.createServer(app);


app.get('/', (req, res) => {
    console.log('Received request for /');
    res.sendFile(path.join(__dirname, 'index.html'));
    res.send('<h1>Welcome from a un-secure server!</h1><h2 style="color: red;">This is not secure!</h2>');
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

https_app.get('/', (req, res) => {
    console.log('Received request for /secure');
    res.sendFile(path.join(__dirname, 'secure.html'));
    res.send('<h1>Welcome from a secure server!</h1><h2 style="color: green;">This is secure!</h2>');
});

const httpsServer = https.createServer(options, https_app);
httpsServer.on('error', (err) => {
    console.error('Error starting HTTPS server:', err);
});

httpsServer.listen(https_port, () => {
    console.log(`HTTPS server is running on https://localhost:${https_port}`);
});