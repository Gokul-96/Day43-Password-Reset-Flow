// index.js

import express from "express";
import { MongoClient } from "mongodb";
import { UsersRouter } from "./route/userRoute.js";
import cors from "cors";
import 'dotenv/config';

const app = express();
const PORT = 9000;

// Inbuilt middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("MongoDB is connected");
    return client;
}

// Create the MongoDB connection and start the server
(async () => {
    const client = await createConnection();

    app.get('/', (req, res) => {
        res.send('Password Reset Flow');
    });

    app.use('/userRoute', UsersRouter);

    app.listen(PORT, () => console.log('The server started on the port', PORT));
})();

export const client = createConnection();