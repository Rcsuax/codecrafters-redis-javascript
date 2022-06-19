const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const store = new Map()

// Uncomment this block to pass the first stage 1
const server = net.createServer(socket => {
  
  socket.on('data', data => {   
    
    const input = data.toString()
    const array = input.split('\r\n')
    
    const op = array[2] // [ '*2', '$4', 'echo', '$6', 'apples', '' ]
    const key = array[4]
    const value = array[6]
    const ttl = array[8]
    
    switch(op) {
      case 'ping':
        socket.write('+PONG\r\n')
        break;
      case 'echo':
        socket.write(`+${array[4]}\r\n`)
        break;
      case 'set':
        console.log(`${op} = K: ${key} V: ${value}`)

        let time = ttl != undefined ? (new Date().getTime() + ttl) : null
        
        store.set(key, { value: value, ttl: time })
        socket.write('+OK')
        break;
      case 'get':
        let out = store.get(key)
        if ( out.ttl - new Date().getTime() > 0 ) {
          socket.write(`+null`)
        }
        else {
          socket.write(`+${out}`)
        }
        break;
    }

  })

  socket.on('end', socket.end)
});

server.listen(6379, '127.0.0.1');