require('dotenv').config()
const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const morgan = require("morgan")
const {Server} = require("socket.io")

app.use(cors());
app.use(morgan('dev'));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
})

//conecxão ao socket
io.on("connection",  (socket)=>{

    //Entrar em uma sala
    socket.on('join_room', (data)=>{
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    });

    //responder a sala
    socket.on('send', (data)=>{
        socket.to(data.room).emit("recive", data)
        console.log([data.room, data])

    });

    //desconectar-se de uma sala
    socket.on("disconnect", ()=>{
        console.log("User Disconnected", socket.id)
    });

})



server.listen(process.env.PORT, ()=>{
    console.log(process.env.PORT)
})
