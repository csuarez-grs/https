require('dotenv').config();
const express = require('express');
const https = require('https');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const passport = require('./auth_strategies/passport');

// Import settings
const { settings } = require('./settings');

const app = express();

app.use(passport.initialize());

app.use(cors({
    origin: settings.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Import routers
const router = require('./Routes/auth');
const adminRouter = require('./Routes/admin');



app.use(session({
    secret: settings.client_secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(bodyParser.json());

app.use('/api/auth', router);

app.use('/authorize', adminRouter);



// app.use('/auth/google', authRouter);

app.get('/', (req, res) => {
    res.send("This is a node server for assignment 3, please login/register to begin");
});

async function connectToDB() {
    try {
        await mongoose.connect(settings.databaseUrl + '/', {
            dbName: settings.databaseName,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to DB");
    } catch(err) {
        console.error("Error while connecting to DB");
        console.error(err);
        process.exit(1);    // terminate the server process.
    }
}

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'private-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'certificate.pem')),
};

https.createServer(httpsOptions, app).listen(
    settings.port, async () => {
    await connectToDB();
    console.log(`server is running on port: ${settings.port}`);
});

const authRouter = require('./Routes/authRoutes');

app.use(authRouter);

module.exports = app;
