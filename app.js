require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

// Import routers
const router = require('./Routes/auth');
const adminRouter = require('./Routes/admin');
const authRouter = require('./Routes/authRoutes');

// Import settings
const { settings } = require('./settings');

const app = express();

app.use(cors({
    origin: settings.frontendUrl,
}))

app.use(session({
    secret: settings.client_secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(bodyParser.json());

app.use('/api/auth', router);

app.use('/authorize', adminRouter);

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

http.createServer(app).listen(
    settings.port, async (req,res) => {
    await connectToDB();
    console.log(`server is running on port: ${settings.port}`);
});

app.use(authRouter);