const Pool = require("pg").Pool;

const pool = new Pool({
    user: process.env.postgresUser,
    password: process.env.postgresPassword,
    host: process.env.postgreshost,
    port: process.env.postgresPort,
    database: process.env.postgresDatabase
})

module.exports = pool;