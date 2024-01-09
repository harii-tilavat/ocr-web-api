const express = require('express');
const db = require('../db/mysql');
const router = express.Router();
const readText = require('text-from-image');

router.route('/')
    .get((req, res) => {
        db.query(`SELECT * FROM employee`, (err, result) => {
            if (!err) {
                res.json({ success: true, data: result });

            } else {
                res.json({ success: false, msg: err.message });
            }
        });
    })

// router.route('/').get((req, res) => {
//     res.json({ success: true });
// });
router.route('/data')
    .get((req, res) => {
        res.json({ sucess: true, msg: 'Hello World' });
    })
module.exports = router;

readText('../uploads/files/image1.png').then((res) => {
    console.log("Data: ", res);
})