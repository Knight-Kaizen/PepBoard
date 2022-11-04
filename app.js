//Access
const express = require("express");
const socket = require("socket.io");

//Initialization and server ready
const app = express();

app.use(express.static("public"));


let port = process.env.PORT || 5000;
let server = app.listen(port, ()=>{
    console.log("listening to port " + port);
})

let io = socket(server);
io.on("connection", (socket) => {
    console.log("socket connection established");

    socket.on("drawStart", (data) => {
        //data received from front - end
        //transfer data to all connected devices.
        io.sockets.emit("drawStart", data);
    })

    socket.on("draw", (data) =>{
        io.sockets.emit("draw", data);
    })

    socket.on("canvasAction", (data)=>{
        io.sockets.emit("canvasAction", data);
    })

})

