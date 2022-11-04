
let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColorEle = document.querySelectorAll(".pencilcolor");
let pencilWidthEle = document.querySelector(".pencilWidth");
let eraserEle = document.querySelector(".eraser");
let eraserWidthEle = document.querySelector(".eraserWidth");
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");
// console.log(pencilColorEle);

let actionTracker = [];
let track = 0;

let tool = canvas.getContext("2d");
let penColor = "black";
let penWidth = "3";
let eraserFlg = false;
let eraserWidth = "3";

canvasInitialiser();
function canvasInitialiser(){
    tool.fillStyle = "white";
    tool.fillRect(0, 0, canvas.width, canvas.height);
    
    let url = canvas.toDataURL();
    actionTracker.push(url);
    track = actionTracker.length - 1;
}



pencilColorEle.forEach((colorEle) => {
    colorEle.addEventListener("click", (e) =>{
        penColor = colorEle.classList[1];
        // console.log(penColor);
    })
})

pencilWidthEle.addEventListener("change", (e)=>{
    penWidth = pencilWidthEle.value;
    // console.log(penWidth);
})

eraserEle.addEventListener("click", (e)=>{
    eraserFlg = !eraserFlg;
})

eraserWidthEle.addEventListener("change", (e) =>{
    eraserWidth = eraserWidthEle.value;
    // console.log(eraserWidth);
})




let mouseDownFlg = false;

canvas.addEventListener("mousedown", (e)=>{
    mouseDownFlg = true;
    let data = {
        x: e.clientX,
        y: e.clientY
    };
    socket.emit("drawStart", data);
})

canvas.addEventListener("mousemove", (e)=>{
    if(mouseDownFlg){
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlg ? "white" : penColor,
            width: eraserFlg ? eraserWidth : penWidth
        };
        socket.emit("draw", data);
    }
    
})

canvas.addEventListener("mouseup", (e)=>{
    mouseDownFlg = false;
    
    let url = canvas.toDataURL();
    actionTracker.push(url);
    track = actionTracker.length-1;
})

function drawStart(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}

function draw(strokeObj){
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
}

undo.addEventListener("click", (e) => {
    if(track > 0) track--;
    //track action
    let data = {
        trackValue: track,
        actionTracker
    }
    socket.emit("canvasAction", data);
})

redo.addEventListener("click", (e) => {
    if(track+1 < actionTracker.length)
    track++;
    //track action
    let data = {
        trackValue: track,
        actionTracker
    }
    socket.emit("canvasAction", data);
})

function canvasAction(data){
    // console.log("here at data");
    track = data.trackValue;
    actionTracker = data.actionTracker;
   
    let url = actionTracker[track];
    let img = new Image(); // new image reference element
    img.src = url;
   
    img.onload = (e)=>{
        // console.log("here");
        tool.clearRect(0, 0, canvas.width, canvas.height);
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

}

download.addEventListener("click", (e)=>{
    // let url = canvas.toDataURL();
    let url = actionTracker[track];

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.png";
    a.click();
})

socket.on("drawStart", (data)=>{
    drawStart(data);
})

socket.on("draw", (data)=>{
    draw(data);
})

socket.on("canvasAction", (data)=>{
    canvasAction(data);
})

