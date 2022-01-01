require('dotenv').config()
const { Pool, Client } = require('pg')
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'nodejs-blog',
//     password: 'TheLORD1011!@#BRM',
//     port: 5432,
// })

const pool = new Pool({
    user: process.env.postgres_user,
    host: process.env.postgres_host,
    database: process.env.postgres_database,
    password: process.env.postgres_password,
    port: process.env.postgres_port,
    ssl: {
        rejectUnauthorized: false,
    }
})


// const poolConfig = process.env.DATABASE_URL ? {
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnAuthorized: false
//     }
// } :
//     {
//         user: 'postgres',
//         password: 'TheLORD1011!@#BRM',
//         host: 'localhost',
//         port: '5432',
//         database: 'nodejs-blog'
//     }

// const pool = new Pool(poolConfig);

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'nodejs-blog',
//     password: 'TheLORD1011!@#BRM',
//     port: 5432,
// })

module.exports = pool