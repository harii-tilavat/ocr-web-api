const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('./public'));

// app.get('/', (req, res) => {
//     try {
//         res.status(200).sendFile(path.resolve(__dirname, './index.html'));
//     } catch (error) {
//         res.send(`<pre> ${error}</pre>`);
//     }
// })
app.get('/test',(req,res)=>{
    console.log("Test request");
    res.send();
})

app.get('/about',(req,res)=>{
    res.sendFile(path.resolve(__dirname, './index.html'));
})
app.all('*', (req, res) => {
    res.send('Error');
})
app.listen(8000, () => {
    console.log("Server running!");
})