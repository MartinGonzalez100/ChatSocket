const nombreUsuario = document.querySelector('#nombre-usuario')
const chat = document.querySelector('#chat')
const textoEntrada = document.querySelector('#texto-entrada')
const escribiendo = document.querySelector('#escribiendo')
const botonEnviar = document.querySelector('#boton-enviar')

var socket = io();

const miMsj = 0

botonEnviar.addEventListener('click',()=>{
  //tp6 validacion
  if(nombreUsuario.value === '' || textoEntrada.value === ''){
    alert('se debe ingresar nombre de usuario y mensaje para enviar')
  }else{
    //verifico por consola los mensajes
    console.log(textoEntrada.value)
    //emito el nombre de usuario y el mensaje al servidor, estos datos sirven para rellenar el userData, y enviar el mensaje al resto de clientes
    socket.emit('mensajeCliente',{
      mensajeCliente:`${nombreUsuario.value} dice: ${textoEntrada.value}`,
      nombreCliente: nombreUsuario.value
    })
  }
})
//envia mensaje al servidor cuando alquien esta tecleando
textoEntrada.addEventListener('keypress', ()=>{
  socket.emit('tecleando',`${nombreUsuario.value} esta escribiendo...` )
  miMsj = 1
})

//recibe mensaje del tp3
socket.on('tp3MsjConexion',(msj)=>{
  console.log(msj)
})

//recibe el mensaje del servicdor cuando alquien esta tecleando
socket.on('escribiendo', (data)=>{
  
  escribiendo.innerHTML = `<p>${data}</p>`
  //despues de 2 segundos borra el mensaje
  setTimeout(()=>{
    escribiendo.innerHTML = '.'
  },2000)
})
//recibe el mensaje desde el servidor para escribirlo en el chat
socket.on('msjServer', (data)=>{
  if(miMsj===1){

    chat.innerHTML += `
    <div class="alert alert-primary" role="alert">
    ${data}
    </div>
    `
  }else{
    chat.innerHTML += `
    <div class="alert alert-success" role="alert">
    ${data}
    </div>
    `

  }
  miMsj = 0
  // console.log(data)
})


// tp2
const btnEnviar = document.querySelector('#btnEnvia')
btnEnviar.addEventListener('click', ()=>{
  socket.emit('tp2',{
    nombre:'Martin',
    edad: 35
  })
})

//recibe los datos del usuario desconectado para mostrarlo
socket.on('usuarioEliminado', (data)=>{
  //verifica por consola el dato recibido
  // console.log(`El susuario ${data} se desconecto`)
  
  //muestro los datos del usuario desconectado
  escribiendo.innerHTML = `<p>El usuario ${data} se desconecto</p>`
  //despues de 2 segundos borra el mensaje
  setTimeout(()=>{
    escribiendo.innerHTML = '.'
  },2000)
})
