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
    const ttl = parseInt(array[10])
    
    const time = ttl !== undefined ? (new Date().getTime() + ttl) : null

    switch(op) {
      case 'ping':
        socket.write('+PONG\r\n')
        break;
      case 'echo':
        socket.write(`+${array[4]}\r\n`)
        break;
      case 'set':        
        store.set(key, { value: value, ttl: time })
        socket.write('+OK')
        break;
      case 'get':
        const result = store.get(key)
        const currentTime = new Date().getTime()
        const expireTime = result.ttl


        console.log(`current: ${ currentTime } expired: ${ expireTime } ttl: ${ result.ttl }`)
        // if currentTime < expireTime === has not expired return value
        // if currentTime > expireTime === has expired     return null

        if ( result.ttl ) {

          if ( currentTime < expireTime ) {
            console.log(`EXPIRED`)
            socket.write(`$-1\r\n`) // Null Bulk String. 
          }
          else {
            console.log(`AVAILBLE`)
            socket.write(`+${result.value}`)
          }
          
        }
        else {
          console.log(`NO TTL`)
          socket.write(`+${result.value}`)
        }

        break;
    }

  })

  socket.on('end', socket.end)
});

server.listen(6379, '127.0.0.1');