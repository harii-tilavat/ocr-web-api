const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.write('Home page');
    }
    else if (req.url === '/about') {
        // BLOCKING CODE
        let data = '';
        for (let i = 0; i <= 10; i++) {
            for (let j = 0; j <= 100; j++) {
                data += `I = ${i} and J = ${j}\n`;
                res.write(`I = ${i} and J = ${j}\n`);
            }
        }
        fs.writeFileSync('./files/loop.txt', data);
        res.write('About page');
    }
    res.end();
})
server.listen(8000, () => {
    console.log("Server running at http://localhost:8000");
})