import express from "express";
import morgan from 'morgan';
import cors from 'cors';
import db from "./database/db.js";
import cookieParser from 'cookie-parser';

import newsRoutes from './routes/newsRoutes.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, *');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(cookieParser())

/*app.use(morgan('dev'))*/
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}))
app.use(express.json())

/* Routes */
app.use('/api/news', newsRoutes)
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes);

// DB connection
try {
    await db.authenticate();
    console.log('DB connection success!!!');
} catch (error) {
    console.log('DB connection error: ', error)
}


//db.sync({force: true});

app.listen(8000, () => {
    console.log('Server running on port 8000')
})