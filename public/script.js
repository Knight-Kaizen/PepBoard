let toolVis = document.querySelector(".toolbarVis");
let toolBar = document.querySelector(".toolbar");
let pencilExt = document.querySelector(".pencilExtension");
let eraserExt = document.querySelector(".eraserExtension");
let pencilTool = document.querySelector(".pencil");
let eraserTool = document.querySelector(".eraser");
let stickyCont = document.querySelector(".stickyNotes");
let upload = document.querySelector(".upload");

let toolVisFlg = true;
let pencilToolFlg = false;
let eraserToolFlg = false;

toolVis.addEventListener("click", (e)=>{
    toolVisFlg  = !toolVisFlg;
    if(toolVisFlg)
    openToolbar();
    else
    closeToolbar();
})

function openToolbar(){
    let toolVisEle = toolVis.children[0];
    // console.log(toolVisEle);
    toolVisEle.classList.remove("fa-times");
    toolVisEle.classList.add("fa-bars");
    toolBar.style.display = "flex";
}
function closeToolbar(){
    let toolVisEle = toolVis.children[0];
    // console.log(toolVisEle);
    toolVisEle.classList.remove("fa-bars");
    toolVisEle.classList.add("fa-times");
    toolBar.style.display = "none";
    pencilExt.style.display = "none";
    eraserExt.style.display = "none";
}

pencilTool.addEventListener("click", (e)=>{
    // console.log("pencil");
    pencilToolFlg = !pencilToolFlg;
    if(pencilToolFlg)
    pencilExt.style.display = "block";
    else
    pencilExt.style.display = "none";
})
eraserTool.addEventListener("click", (e)=>{
    // console.log("eraser");
    eraserToolFlg = !eraserToolFlg;
    if(eraserToolFlg)
    eraserExt.style.display = "flex";
    else
    eraserExt.style.display = "none";
})

upload.addEventListener("click", (e)=>{
    
    // Open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e)=>{
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTML = `
        <div class="notesHeader">
            <div class="min"></div>
            <div class="close"></div>
        </div>
        <div class="textArea">
            <img src="${url}"/>
        </div>
        `;
        createSticky(stickyTemplateHTML);
    })

})

stickyCont.addEventListener("click", (e)=>{
    let stickyTemplateHTML = `
    <div class="notesHeader">
        <div class="min"></div>
        <div class="close"></div>
    </div>
    <div class="textArea">
        <textarea spellcheck="false" class = "notes"></textarea>
    </div>
    `;

    createSticky(stickyTemplateHTML);
})

function createSticky(stickyTemplateHTML){
    // console.log("sticky");
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "stickyNoteCont");
    stickyCont.innerHTML = stickyTemplateHTML;
    document.body.appendChild(stickyCont);

    let minimize = document.querySelector(".min");
    let remove = document.querySelector(".close");
    NotesAction(minimize, remove);

    stickyCont.onmousedown = function (event) {
        dragAndDrop(stickyCont, event);
    };

    stickyCont.ondragstart = function () {
        return false;
    };
}

function NotesAction(minimize, remove){
    let stickyNoteCont = document.querySelector(".stickyNoteCont");
    remove.addEventListener("click", (e) => {
        stickyNoteCont.remove();
    })

    minimize.addEventListener("click", (e) => {
        let noteCont = document.querySelector(".textArea");
        
        let display = getComputedStyle(noteCont).getPropertyValue("display");
   
        if (display === "none") noteCont.style.display = "block";
        else noteCont.style.display = "none";
       
    })
}



function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}

