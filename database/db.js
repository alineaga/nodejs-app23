const { Pool, Client } = require('pg')
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'nodejs-blog',
    password: 'TheLORD1011!@#BRM',
    port: 5432,
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