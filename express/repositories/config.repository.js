// ---------------------------- I created this for testing purpose --------------------------------

const express = require('express');
const mysql = require('../db/mysql');

class ConfigRepo {
    userSigninRepo() {
        return new Promise(async (resolve, reject) => {
            try {
                const query = 'INSERT INTO users (userId,email,username,password) values (?, ?, ?, ?)';
                mysql.query();     
            } catch (error) {

            }
        })
    }
}
module.exports = ConfigRepo;