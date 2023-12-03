const mysql = require("mysql");

const DB_CONNECTION_OPTIONS = {
    password: process.env.DB_PW,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    // connectionLimit: 10,
    // createDatabaseTable: true,
};


function getGamitarDbCon() {
    return mysql.createPool(DB_CONNECTION_OPTIONS);
}

module.exports = {
    DB_CONNECTION_OPTIONS,
    getGamitarDbCon,
};
