require('dotenv').config()
const express = require("express");
const cors = require("cors");
//const pool = require('./db.js');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const app = express();
const userRoutes = require("./routes/index");
const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.allowedOrigins
//good cors options
const corsOptions = {
    credentials: true, // This is important.
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin))
            return callback(null, true)
        callback(new Error('Not allowed by CORS'));
    }
}
//testing without allowedOrigins
// const corsOptions = {
//     credentials: true, // This is important.
//     origin: '*'
// }
const morgan = require('morgan')
const helmet = require('helmet')
const apicache = require('apicache')
// Init cache
let cache = apicache.middleware
const errorHandler = require('./middleware/error')
const jwtsecret = process.env.jwtsecret
const { Pool, Client } = require('pg');
const uuid4 = require('uuid4');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const pgSession = require('connect-pg-simple')(expressSession);
//csrf
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })
var { randomBytes } = require('crypto');

const RateLimit = require('express-rate-limit')
//import * as RateLimit from 'express-rate-limit';
//import rateLimit from 'express-rate-limit'
// Rate limiting
//const limiter = rateLimit({
//    windowMs: 10 * 60 * 1000, // 10 Mins
//    max: 30,
//})
//app.use(limiter)
// app.use(
//     rateLimit({
//         windowMs: 60 * 1000, // 1 minutes
//         max: 10, // limit each IP to 100 requests per windowMs
//     }),
// );
const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
//https://www.npmjs.com/package/express-rate-limit
// Apply the rate limiting middleware to all requests
app.use(limiter)
//app.set('trust proxy', 1)

//not working database
// const poolConfig = process.env.DATABASE_URL ? {
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnAuthorized: false
//     }
// } : {
//     user: 'postgres',
//     host: 'localhost',
//     database: 'nodejs-blog',
//     password: 'TheLORD1011!@#BRM',
//     port: 5432
// }
// const pool = new Pool(poolConfig)

//works database
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'nodejs-blog',
//     password: 'TheLORD1011!@#BRM',
//     port: 5432,
// })
const pool = require('./database/db.js')

app.use(morgan(':method:status:url"HTTP/:http-version"'))
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
//app.use(csrf({ cookie: true }))


app.use(expressSession({
    name: 'session_refresh',
    store: new pgSession({
        pool: pool,                // Connection pool
        tableName: 'user_sessions'   // Use another table-name than the default "session" one
        // Insert connect-pg-simple options here
    }),
    secret: process.env.SESS_COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1 * 60 * 15 * 1000 } // 30 days /30
}));
//get csrf old
app.get("/api/csrf", csrfProtection, async (req, res, next) => {
    try {
        if (req.session.csrf === undefined) {
            req.session.csrf = randomBytes(100).toString('base64'); // convert random data to a string
        }
        //console.log('user_session', [req.session])
        res.locals._csrf = await req.csrfToken();
        res.json({ csrfToken: req.csrfToken(), csrf: req.session.csrf, message: 'Hi Alin' })
    } catch (error) {
        console.log('error_get/api/csrf', error)
    }
})
// app.get("/api/vcsrf", csrfProtection, (err, req, res, next) => {
//     try {
//         const nothing = req.session.csrf
//         console.log('nothing: ', nothing)
//         if (err.code !== 'EBADCSRFTOKEN') return next(err)
//         //  handle CSRF token errors here
//         //res.status(403).send({ err: err.code })
//         //res.send('form tampered with').
//         res.status(200).send({ message: 'csOrKf' })
//     } catch (error) {
//         console.log('error_post/api/csrf', error)
//     }

// })
app.post("/api/csrftoken", csrfProtection, async (err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
    // handle CSRF token errors here
    res.status(403).send({ error: 'csrf token missing' })
    res.send('form tampered with')
})
// error handler
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)

    // handle CSRF token errors here
    res.status(403)
    res.send('form tampered with')
})
//csrf
// app.get("/api/csrftoken", csrfProtection, userRoutes)
// app.post("/api/csrftoken", csrfProtection, userRoutes)
//get
app.get("/api/", csrfProtection, userRoutes)
app.get("/api/posts", csrfProtection, userRoutes)
app.get("/api/posts/title/:title", csrfProtection, userRoutes)
app.get("/api/posts/id/:id", csrfProtection, userRoutes)
app.get("/api/logout", csrfProtection, userRoutes)
app.get("/api/verify", csrfProtection, userRoutes)
//posts
app.post("/api/posts", csrfProtection, userRoutes)
app.post("/api/register", userRoutes)
app.post("/api/login", csrfProtection, userRoutes)


app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})


