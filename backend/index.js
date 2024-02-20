import  express from "express";
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv";

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

import { connectionString } from "./config.js";
import {returnError} from "./src/exceptions/ErrorHandler.js";
//regarding LOGs
import morgan from 'morgan';
import winston from 'winston';

import adminRoutes from './src/routes/adminRoutes.js' 
import authRoutes from './src/routes/authRoutes.js'
import cspRoutes from './src/routes/cspRoutes.js'

//connected to mongo database.
mongoose.set('strictQuery', false);
mongoose.connect(connectionString)
    .then(() => {
        console.log(`Database connected`)
    })
    .catch((err) => {
        console.log(err)
    })

//server creation and started 
const port = 5510
const app = express();
app.options("*", cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(express.json())


// Morgan for HTTP request logging
app.use(morgan('tiny'));

// Winston for more detailed logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// Middleware for logging the API request and response
app.use((req, res, next) => {
    res.on('finish', () => {
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            responseTime: res.getHeader('X-Response-Time'),
        });
    });
    next();
});


app.get('/', (req, res) => {res.send('hi server is on SFS');})

app.get('/api', (req, res) => { res.send('Hello World, from serversfs express.') });
app.use('/api/admin', adminRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/csp', cspRoutes)

// app.use('/api/user', userRoutes)

app.use(returnError);

app.listen(port, () => {
    console.log(`Server started at ${port}`)
})

