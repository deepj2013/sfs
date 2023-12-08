import  express from "express";
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv";

//import config file
import { connectionString } from "./config.js";
import {returnError} from "./src/exception/ErrorHandler.js"


//connected to mongo database.
mongoose.set('strictQuery', false);
mongoose.connect(connectionString)
    .then(() => {
        console.log('Connected')
    })
    .catch((err) => {
        console.log(err)
    })
console.log("hello  world!");

//server creation and started 
const port = 5510
const app = express();
app.options("*", cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(express.json())

app.get('/api', (req, res) => { res.send('Hello World, from serversfs express.') });
// app.use('/api/admin', adminRoutes)
// app.use('/api/user', userRoutes)

app.use(returnError);

app.listen(port, () => {
    console.log(`Server started at ${port}`)
})

