const app = require('express')()

const http = require('http').Server(app)

const io = require('socket.io')(http)


// app.get('/', (req, res)=>{
//   res.sendFile(__dirname+'/index.html')
// })

app.use(require('express').static('public'))

//registros de usuarios conectados
var userData = []


io.on('connection', (socket)=>{
  console.log(`Usuario conectado id: ${socket.id}`)
  
  //tp3 solucion
  io.emit('tp3MsjConexion', `El Usuario ${socket.id} se conecto`)

  //recibiendo mensajes del cliente
  socket.on('mensajeCliente',(data)=>{
    console.log('mensaje desde el cliente:', data.mensajeCliente)
    //cargando registro de usuarios
    userData.push({
      idUser: socket.id,
      userName: data.nombreCliente 
    })
    console.log('El suerData: ',userData)
    //enviando a todos los clientes el mensaje recibido de un cliente especifico
    io.emit('msjServer',data.mensajeCliente)
  })

  //recibe el dato de quien esta escribiendo
  socket.on('tecleando',(data)=>{
    //envia el dato a todos lo socket menos al emisor original
    socket.broadcast.emit('escribiendo',data)
  })
  //recibiendo solucion del tp2
  socket.on('tp2',(data)=>{
    console.log(`El nombre es : ${data.nombre} la edad es: ${data.edad}`)
  })

  
  //esto es para ver los usuarios desconectados
  socket.on('disconnect', ()=>{
    console.log(`usuario cliente desconectado ${socket.id}`)
    
  })

  
  //esto es para manejar los datos de usuarios justo antes de desconectarse
  socket.on('disconnecting',(reason)=>{
    //verificando registro de usuarios antes de desconectar a un usuario
    // console.log('antes de desconexion:', userData)
        
    //usX contiene solo el objeto del usuario a desconectar
    var usX = userData.filter( e => { return e.idUser === socket.id})
    
    //envio el nombre del usuario a desconectar a todos los clientes
    io.emit('usuarioEliminado', usX[0].userName )
    
    //verifico el id del usuario a desconectar
    // console.log(`el susuario: ${socket.id} se desconectara`)
    
    //en este punto desaparece data????
    // console.log('luego de desconexion :',userData)
  })

  

})


let puerto = 8080
http.listen(puerto, ()=>{
  console.log(`Escuchando puerto: ${puerto}`)
})