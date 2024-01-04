const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const fileStream = fs.createReadStream('./files/big.txt', 'utf-8');
    fileStream.on('data', (data) => {
        console.log("File Opened -> ", data.length);
        // fileStream.pipe(res);
        // res.end(data);
        fileStream.pipe(res);
    })
    fileStream.on('error', (err) => {
        console.log("Error coming");
        res.end(err.message);
    })

})
server.listen(8000, () => {
    console.log("Server stared!");
})
console.log(new Date() instanceof Date);