require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./routes/auth');
const adminRouter = require('./Routes/admin');
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const app = express();

const FRONTEND_URL = "http://localhost:5173";

app.use(cors({
    origin: FRONTEND_URL,
}))

app.use(bodyParser.json());

app.use('/api/auth', router);

app.use('/authorize', adminRouter);

app.get('/', (req, res) => {
    res.send("This is a node server for assignment 3, please login/register to begin");
});

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDB() {
    try{
        await client.connect();
        await client.db(dbName).command({ ping: 1 });
        console.log("Connected to database");
    } catch(err) {
        console.error("Error while connecting to database");
        console.error(err);
        process.exit(1);
    }
}

http.createServer(app).listen(process.env.PORT, async (req,res) => {
    await connectToDB();
    console.log(`server is running on port: ${process.env.PORT}`);
});