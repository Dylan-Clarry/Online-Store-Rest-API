// ====================
// imports
// ====================
const http = require('http');
const app = require('./app');

// port number
const port = process.env.PORT || 3000;

//start server
const server = http.createServer(app);
server.listen(port);
console.log("listening on port " + port);