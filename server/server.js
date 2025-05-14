const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

server.listen(port,()=>{
    console.log(`listening on port ${port}`)
});