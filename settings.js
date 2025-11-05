const config = require('dotenv').config;
if (config.error) {
    throw new Error("Failed to load environment variables from .env file");
}

config();

const settings = {
    port: process.env.PORT || 2022,
    client_id: process.env.CLIENT_ID || 'default-client-id',
    client_secret: process.env.CLIENT_SECRET || 'default-client-secret',
    auth_uri: process.env.AUTH_URI || 'https://default-auth-uri.com',
    token_uri: process.env.TOKEN_URI || 'https://default-token-uri.com',
    project_id: process.env.PROJECT_ID || 'default-project-id',
    redirect_uri: process.env.REDIRECT_URI || 'https://default-redirect-uri.com',
    databaseUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp',
    jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret',
    logLevel: process.env.LOG_LEVEL || 'info',
    apiVersion: process.env.API_VERSION || 'v1',
    allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'],
    google_callback_url: '/auth/google/callback',
    databaseName: process.env.DB_NAME || 'default-db-name',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

module.exports = { settings };