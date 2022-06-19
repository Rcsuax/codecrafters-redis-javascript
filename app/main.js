const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer(socket => {
  
  socket.on('data', data => {   
    
    const input = data.toString()
    const array = input.split('\r\n')
    const op = array[2] // [ '*2', '$4', 'echo', '$6', 'apples', '' ]
    
    if ( op === 'ping' ) {
      socket.write('+PONG\r\n')
    }
    else if (op === 'echo' ) {
      socket.write(`+${array[4]}\r\n`)
    }

  })

  socket.on('end', socket.end)
});

server.listen(6379, '127.0.0.1');