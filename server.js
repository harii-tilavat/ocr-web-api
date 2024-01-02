const http = require('http');
const startServer = (data) => {
    const server = http.createServer((req, res) => {
        res.write(data);
        res.end();
    })
    server.listen(8000, () => {
        console.log("Server running at http://localhost:8000");
    })
}
module.exports = startServer;