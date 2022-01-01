require('dotenv').config()
const express = require("express");
const cors = require("cors");
//const pool = require('./db.js');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.allowedOrigins
const corsOptions = {
    credentials: true, // This is important.
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin))
            return callback(null, true)
        callback(new Error('Not allowed by CORS'));
    }
}
const apicache = require('apicache')
// Init cache
let cache = apicache.middleware

const rateLimit = require('express-rate-limit')
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
app.set('trust proxy', 1)

const errorHandler = require('../middleware/error')
const jwtsecret = process.env.jwtsecret
const { Pool, Client } = require('pg');
const uuid4 = require('uuid4');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const pgSession = require('connect-pg-simple')(expressSession);

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
const pool = require('../database/db.js')


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())


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
    cookie: { maxAge: 1 * 60 * 7 * 1000 } // 30 days /30
}));



app.get('/', cache('1 minutes'), (req, res) => {
    res.json("Hello ")
});

app.use(errorHandler)

const authorization = (req, res, next) => {
    try {
        const sestest = req.session
        console.log('session__authorization: ', sestest)
        //const headers = req.headers
        //console.log('headers__verify: ', headers)
        //console.log('headers__verify: ', headers.cookie)
        //let session_iniatializingv = headers.cookie.split('=')
        // console.log('session_iniatializingv1: ', session_iniatializingv)
        // console.log('session_iniatializingv2: ', session_iniatializingv[0])
        // console.log('session_iniatializingv3: ', session_iniatializingv[1].split(';'))
        // console.log('session_iniatializingv4: ', session_iniatializingv[2])
        //let verifcookienow = session_iniatializingv[1].split(';')[0] === req.cookies.session_initializing ? true : false
        //console.log('verifcookienow: ', verifcookienow)
        const cookieVerify = req.cookies.session_initializing
        //console.log('cookieVerify: ', cookieVerify)
        const verifyToken = jwt.verify(cookieVerify, process.env.jwtsecret);
        //console.log('verifyToken: ', verifyToken)
        if (verifyToken && cookieVerify == req.session.token) {
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
app.get('/posts', authorization, async (req, res) => {
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

app.post('/posts', async (req, res) => {
    try {
        //const { post } = req.params;
        const postid = uuid4();
        //const postid = 3
        console.log('postid: ', postid)
        const { title, content, author } = req.body
        console.log('req.body: ', req.body)
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

app.get('/posts/title/:title', async (req, res) => {
    try {
        const title = req.params.title
        console.log('title: ', title)
        const selecttquery = "select * from posts where post_title like $1"
        const valuesquery = [title]
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

app.get('/posts/id/:id', async (req, res) => {
    try {
        const id = await req.params.id
        console.log('id: ', id)
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


app.post('/register', async (req, res) => {
    try {
        const { user_email, user_password, user_name } = await req.body
        const selecttquery = "insert into users(user_email, user_password, user_name) values($1,$2,$3)"
        const hash = bcrypt.hashSync(user_password, 11);
        console.log(hash);
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


app.post('/login', async (req, res) => {
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
                            console.log('token: ', token)
                            // res.cookie('session_iniatializing', token)
                            const rememberDays = 1
                            const ckOptions = {
                                //expires: new Date(Date.now() + rememberDays),
                                maxAge: 1 * 60 * 5 * 1000,
                                httpOnly: true,
                                secure: true
                            };
                            //console.log('ckOptions: ', ckOptions)
                            //res.cookie('session_initial', token, ckOptions);
                            req.session.user_name = response.rows[0].user_name
                            req.session.token = token
                            console.log('req.session: ', req.session)
                            res.cookie('session_initializing', token, ckOptions);
                            res.setHeader('token', token).json({ user_name: response.rows[0].user_name, token: token })
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

app.post('/verify', async (req, res) => {

    // let session_iniatializingvc = JSON.toString(session_iniatializingv[1])
    // console.log('session_iniatializingvc: ', session_iniatializingvc)
    try {
        const sestest = await req.session
        console.log('session__authorization: ', sestest)
        //const headers = req.headers
        //console.log('headers__verify: ', headers)
        //console.log('headers__verify: ', headers.cookie)
        //let session_iniatializingv = headers.cookie.split('=')
        // console.log('session_iniatializingv1: ', session_iniatializingv)
        // console.log('session_iniatializingv2: ', session_iniatializingv[0])
        // console.log('session_iniatializingv3: ', session_iniatializingv[1].split(';'))
        // console.log('session_iniatializingv4: ', session_iniatializingv[2])
        //let verifcookienow = session_iniatializingv[1].split(';')[0] === req.cookies.session_initializing ? true : false
        //console.log('verifcookienow: ', verifcookienow)
        const cookieVerify = await req.cookies.session_initializing
        //console.log('cookieVerify: ', cookieVerify)
        const verifyToken = await jwt.verify(cookieVerify, process.env.jwtsecret);
        //console.log('verifyToken: ', verifyToken)
        if (verifyToken && cookieVerify == req.session.token) {
            res.json({
                user_name: req.session.user_name
            })
        } else {
            res.json({
                error: 'Not logged in verify!'
            })
        }

    } catch (err) {
        console.log('err_verify: ', err)
        res.json({
            error: err
        })
    }
})

app.get('/logout', authorization, async (req, res) => {
    res.clearCookie('session_initializing');
    req.session.token = ''
    req.session.user_name = ''
    res.json({
        token: req.session.token, user_name: req.session.user_name
    })
})

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})


