const fs = require('fs');
const pdf = require('pdf-parse');
const express = require('express');
const app = express();



app.get('/', (req, res) => {
    
    let dataBuffer = fs.readFileSync('../../../sql.pdf');
    pdf(dataBuffer).then(function (data) {
        // console.log(data);
        res.send(`<pre>${data.text} </pre>`);

    });
})
app.listen(8000, () => {
    console.log("Server started at http://localhost:8000");
})