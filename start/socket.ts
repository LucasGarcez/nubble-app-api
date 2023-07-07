import Ws from 'App/Shared/Services/Ws'
Ws.boot()

Ws.io.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' })

  socket.on('my other event', (data) => {
    console.log(data)
  })
})
