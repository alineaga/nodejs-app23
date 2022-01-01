require('dotenv').config()
const express = require("express");
//const cors = require("cors");
//const pool = require('./db.js');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const userRoutes = express();
//const PORT = process.env.PORT || 5000;
//const allowedOrigins = process.env.allowedOrigins
//good cors options
// const corsOptions = {
//     credentials: true, // This is important.
//     origin: (origin, callback) => {
//         if (allowedOrigins.includes(origin))
//             return callback(null, true)
//         callback(new Error('Not allowed by CORS'));
//     }
// }
//testing without allowedOrigins
// const corsOptions = {
//     credentials: true, // This is important.
//     origin: '*'
// }
const apicache = require('apicache')
// Init cache
let cache = apicache.middleware
const rateLimit = require('express-rate-limit')
const errorHandler = require('../middleware/error')
const jwtsecret = process.env.jwtsecret
const { Pool, Client } = require('pg');
const uuid4 = require('uuid4');
const expressSession = require('express-session');
const pgSession = require('connect-pg-simple')(expressSession);
const pool = require('../database/db.js')
//import rateLimit from 'express-rate-limit'
// Rate limiting
//const limiter = rateLimit({
//    windowMs: 10 * 60 * 1000, // 10 Mins
//    max: 30,
//})
//userRoutes.use(limiter)
// userRoutes.use(
//     rateLimit({
//         windowMs: 60 * 1000, // 1 minutes
//         max: 10, // limit each IP to 100 requests per windowMs
//     }),
// );
//csrf
//const cookieSession = require('cookie-session')
//var { randomBytes } = require('crypto');
//const csrf = require('csurf')
const cookieParser = require('cookie-parser');
//const csrfProtection = csrf({ cookie: true })
userRoutes.use(cookieParser())
userRoutes.use(express.urlencoded({ extended: false }))
userRoutes.set('trust proxy', 1)
// userRoutes.use(cors(corsOptions));

userRoutes.use(errorHandler)
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
// userRoutes.use(function (err, req, res, next) {
//     if (err.code !== 'EBADCSRFTOKEN') return next(err)

//     // handle CSRF token errors here
//     res.status(403)
//     res.send('form tampered with')
// })

userRoutes.get('/api/', cache('1 minutes'), (req, res) => {
    res.json("Hello ")
});


const authorization = async (req, res, next) => {
    try {
        const sestest = await req.session
        //console.log('session__authorization: ', sestest)
        //console.log('req.cookies__authorization: ', req.cookies)
        const cookieVerify = await req.cookies.session_initializing
        //console.log('cookieVerify: ', cookieVerify)
        const verifyToken = await jwt.verify(cookieVerify, process.env.jwtsecret);
        //console.log('verifyToken: ', verifyToken)
        if (verifyToken && cookieVerify === req.session.token) {
            // res.json({
            //     cookieVerify: cookieVerify
            // })
            next()
        } else {
            res.json({
                error: 'Not logged in authorization!'
            })
        }
    } catch (err) {
        console.log('err_authorization: ', err)
        res.json({
            error: err
        })
    }
}
//begin csrf
// userRoutes.get("/api/csrftoken", csrfProtection, authorization, async (req, res, next) => {
//     if (req.session.csrf === undefined) {
//         req.session.csrf = randomBytes(100).toString('base64'); // convert random data to a string
//     }
//     //console.log('user_session_token', [req.session.csrf])
//     res.locals._csrf = req.csrfToken();
//     //console.log('res.locals._csrf', res.locals._csrf)
//     res.json({ csrfToken: req.csrfToken, message: 'Hi Alin' })
// })

// userRoutes.post("/api/csrftoken", csrfProtection, async (err, req, res, next) => {
//     if (err.code !== 'EBADCSRFTOKEN') return next(err)
//     // handle CSRF token errors here
//     res.status(403).send({ error: 'csrf token missing' })
//     res.send('form tampered with')
// })
//end csrf

userRoutes.get('/api/posts', authorization, async (req, res) => {
    try {
        pool.query('SELECT * from public.posts', (err, response) => {
            //console.log(err, res)
            if (err) {
                console.log('err: ', err)
            }
            if (response) {
                //console.log('response: ', response)
                res.json({ posts: response.rows })
            }
            //pool.end()
        })
    } catch (err) {
        console.log('err: ', err)
    }

    // try {
    //     const posts = await pool.query("select * from posts");
    //     res.json({ posts: posts.rows })
    // } catch (error) {
    //     console.log('error.message0 /posts: ', error)
    //     console.log('error.message1 /posts: ', error.message)
    // }



});

userRoutes.post('/api/posts', authorization, async (req, res) => {
    try {
        //const { post } = req.params;
        const postid = uuid4();
        //const postid = 3
        //console.log('postid: ', postid)
        const { title, content, author } = req.body
        //console.log('req.body: ', req.body)
        const insertquery = "insert into posts(post_id, post_title, post_content, post_author) values($1,$2,$3,$4)"
        const valuesquery = [postid, title, content, author]
        pool.query(insertquery, valuesquery, (err, response) => {
            //console.log(err, res)
            if (err) {
                console.log('err: ', err)
            }
            if (response) {
                //console.log('response: ', response)
                res.json({ posts: { postid, title, content, author } })
            }
            //pool.end()
        })
    } catch (err) {
        console.log('err: ', err)
    }
});

userRoutes.get('/api/posts/title/:title', authorization, async (req, res) => {
    try {
        const title = req.params.title
        //console.log('title: ', title)
        const selecttquery = "select * from posts where post_title like $1"
        const valuesquery = [title]
        pool.query(selecttquery, valuesquery, (err, response) => {
            //console.log(err, res)
            if (err) {
                console.log('err: ', err)
            }
            if (response) {
                //console.log('response: ', response.rows)
                res.json({ posts: response.rows })
            }
            //pool.end()
        })
    } catch (err) {
        console.log('err: ', err)
    }
});

userRoutes.get('/api/posts/id/:id', authorization, async (req, res) => {
    try {
        const id = await req.params.id
        //console.log('id: ', id)
        const selecttquery = "select * from posts where post_id = $1"
        const valuesquery = [id]
        pool.query(selecttquery, valuesquery, (err, response) => {
            //console.log(err, res)
            if (err) {
                console.log('err: ', err)
            }
            if (response) {
                console.log('response: ', response.rows)
                res.json({ posts: response.rows })
            }
            //pool.end()
        })
    } catch (err) {
        console.log('err: ', err)
    }
});


userRoutes.post('/api/register', async (req, res) => {
    try {
        const { user_email, user_password, user_name } = await req.body
        const selecttquery = "insert into users(user_email, user_password, user_name) values($1,$2,$3)"
        const hash = bcrypt.hashSync(user_password, 11);
        //console.log(hash);
        const valuesquery = [user_email, hash, user_name]
        await pool.query(selecttquery, valuesquery, (err, response) => {
            //console.log(err, res)
            if (err) {
                console.log('err: ', err)
            }
            if (response) {
                console.log('response: ', response.rows)
                res.json({ users: response.rows })
            }
            //pool.end()
        })
    } catch (err) {
        console.log('err: ', err)
    }
});


userRoutes.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const selecttquery = "select * from users where user_email like $1"
        const valuesquery = [email]
        await pool.query(selecttquery, valuesquery, (err, response) => {
            //console.log(err, res)
            if (err) {
                console.log('err: ', err)
            }
            //console.log('response0: ', response.rows)
            //console.log('response1: ', response.rows[0])
            //console.log('response2: ', response.rows[0].user_password)
            if (response && response.rows[0]) {
                //console.log('response3: ', response.rows)
                try {
                    //console.log(password, response.rows[0].user_password)
                    bcrypt.compare(password, response.rows[0].user_password).then(function (result) {
                        console.log('result_compare:', result)
                        if (result) {
                            const token = jwt.sign(response.rows[0].user_name, jwtsecret)
                            //console.log('token: ', token)
                            // res.cookie('session_iniatializing', token)
                            const rememberDays = 1
                            const ckOptions = {
                                //expires: new Date(Date.now() + rememberDays),
                                maxAge: 1 * 60 * 15 * 1000,
                                httpOnly: true,
                                secure: true
                            };
                            //console.log('ckOptions: ', ckOptions)
                            //res.cookie('session_initial', token, ckOptions);
                            req.session.user_name = response.rows[0].user_name
                            req.session.token = token
                            //console.log('req.session: ', req.session)
                            res.cookie('session_initializing', token, ckOptions);
                            //res.setHeader('token', token)
                            res.json({ user_name: response.rows[0].user_name, csrf: req.session.csrf, token: token })
                            //res.json({ posts: response.rows })
                        } else {
                            res.json({ error: 'Bad combination user/password' })
                        }
                    });
                } catch (err) {
                    console.log('err: ', err)
                }

            }
            //pool.end()
        })
    } catch (err) {
        console.log('err: ', err)
    }
});

userRoutes.get('/api/verify', authorization, async (req, res) => {
    try {
        let user_name = await req.session.user_name
        res.json({ user_name: user_name, csrf: req.session.csrf })
    } catch (err) {
        console.log('err_/api/verify: ', err)
        res.json({
            error: err
        })
    }
})

userRoutes.get('/api/logout', authorization, async (req, res) => {
    res.clearCookie('session_initializing');
    req.session.token = ''
    req.session.user_name = ''
    res.json({
        token: req.session.token, user_name: req.session.user_name
    })
})

module.exports = userRoutes;
