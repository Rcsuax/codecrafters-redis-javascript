const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer(socket => {
  socket.on('data', data => {
    console.log('DATA RECEIVED')
    console.log(data.toString())
  })
  socket.pipe(socket);
});

server.on('connection', socket => {
  console.log("CONNECTION MADE")
})

server.listen(6379, '127.0.0.1');

function encodeRESP(str) {
  return `+${str}`
}