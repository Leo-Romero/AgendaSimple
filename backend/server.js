const http = require('http');       // servidor http
const requestHandler = require('./request-handler');
const server = http.createServer(requestHandler)

server.listen(5000,() => {
    console.log('el servidor está escuchando en http://localhost:5000/');
});
