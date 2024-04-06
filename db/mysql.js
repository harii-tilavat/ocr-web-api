const mysql = require('mysql2');
const dbConfig = {
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: 'UTC+5.30',
};

const pool = mysql.createPool(dbConfig);

module.exports = {
    execute: (query, params) => new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.query(query, params, (error, data) => {
                connection.release(); // Release the connection back to the pool
                if (error) {
                    return reject(error);
                }
                resolve(data);
            });
        });
    }),
};

// const config = require('config');
// const dbConfig = config.get('db.mysql');
// module.exports = {
//     /**
//      * @param {string} query
//      * @param {array} params
//      */
//     execute: (query, params) => new Promise((resolve, reject) => {
//         try {
//             const connection = mysql.createConnection({
//                 host: dbConfig.host,
//                 user: dbConfig.user,
//                 password: dbConfig.password,
//                 database: dbConfig.database,
//                 // timezone: 'UTC+5.30',
//                 typeCast: (field, useDefaultTypeCasting) => {
//                     try {
//                         if (field.type === 'BIT' && field.length === 1) {
//                             const bytes = field.buffer();
//                             return bytes[0] === 1;
//                         }
//                         return useDefaultTypeCasting();
//                     } catch (error) {
//                         console.log('Casting failed ', error);
//                     }
//                 },
//             });
//             connection.config.queryFormat = function (q, values) {
//                 try {
//                     if (!values) return q;
//                     if (q.indexOf(':') === -1) {
//                         return mysql.format(q, values);
//                     }
//                     const finalQuery = q.replace(/:(\w+)/g, (txt, key) => {
//                         if (values.hasOwnProperty(key)) {
//                             return this.escape(values[key]);
//                         }
//                         return txt;
//                     });
//                     return finalQuery;
//                 } catch (_) {
//                     return q;
//                 }
//             };
//             connection.connect();
//             connection.query(query, params, (error, data) => {
//                 try {
//                     connection.end();
//                     if (error) {
//                         return reject(error);
//                     }
//                     return resolve(data);
//                 } catch (e) {
//                     connection.end();
//                     return reject(e);
//                 }
//             });
//         } catch (error) {
//             reject(error);
//         }
//     }),
// };
