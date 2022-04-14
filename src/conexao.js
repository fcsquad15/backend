const { Pool } = require('pg');

const pool = new Pool({
    user: 'bdprnbiaycnnkw',
    host: 'ec2-54-160-109-68.compute-1.amazonaws.com',
    database: 'dar0mdvfjjg51b',
    password: 'c184802239664ee954eb45fee83fb6001fc8e4a6574e42e78482ddb20ea34ddc',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
})

const query = (text, param) => {
    return pool.query(text, param)
}

module.exports = {
    query
}