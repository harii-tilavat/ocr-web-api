const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'proflex004',
    database: 'office'
});
db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected successfully");
    }
})

module.exports = db