// Tracks current drawing settings
const drawingState = {
    mode: "solid",
    color: "#000000"
}

// Creates the grid
function createGrid(size) {
    const gridContainer = document.querySelector("#container");
    gridContainer.innerHTML = "";
    for (let i = 0; i < size * size; i++) {
        squareGrid = createSquare(size)
        gridContainer.appendChild(squareGrid);
    }
}

// Creates the squares with hovering functionality
function createSquare(size) {
    // Allows css flexbox to fix the grid
    let square = document.createElement("div");
    square.classList.add("square");

    // Dynamically computes square size
    const squareSize = 960 / size;

    // Sets the square size
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;

    // Check chosen state and apply
    switch (drawingState.mode) {
        case "rainbow":
            rainbowColor(square);
            break;
        case "shade":
            progressiveShading(square);
            break;
        default:
            solidColor(square);
    }

    return square;
}

// Default hover/drawing effect
function solidColor(square) {
    // Tracks if mouse button is held down
    let isDrawing = false;

    // EventListeners to aid in tracking mouse button state
    document.addEventListener("mousedown", ()=>{
        isDrawing = true;
    });

    document.addEventListener("mouseup", ()=>{
        isDrawing = false;
    });

    // Colors using chosen color
    square.addEventListener("mouseover", ()=>{
        if (isDrawing) {
            square.style.backgroundColor = drawingState.color;
        }
    });

    // Ensures color even without mouse being dragged
    square.addEventListener("mousedown", ()=>{
        square.style.backgroundColor = drawingState.color;
    });
}

// Rainbow color mode
function rainbowColor(square) {
    let isDrawing = false;

    document.addEventListener("mousedown", ()=>{
        isDrawing = true;
    });

    document.addEventListener("mouseup", ()=>{
        isDrawing = false;
    });

    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    square.addEventListener("mouseover", ()=>{
        if (isDrawing) {
            square.style.backgroundColor = getRandomColor();
        }
    });

    square.addEventListener("mousedown", ()=>{
        square.style.backgroundColor = getRandomColor();
    });
}

// Progressive shading mode
function progressiveShading(square) {
    let isDrawing = false;
    square.style.backgroundColor = drawingState.color;
    square.style.opacity = "0";

    document.addEventListener("mousedown", ()=>{
        isDrawing = true;
    });

    document.addEventListener("mouseup", ()=>{
        isDrawing = false;
    });

    function darken(element) {
        let currentOpacity = parseFloat(window.getComputedStyle(element).opacity);
        if (currentOpacity < 1) {
            element.style.opacity = (currentOpacity + 0.1).toFixed(1);
        }
    }

    square.addEventListener("mouseover", ()=>{
        if (isDrawing) {
            darken(square);
        }
    });

    square.addEventListener("mousedown", ()=>{
        darken(square);
    });

}

// Handles making grid as per user specifications
function resizeGrid() {
    let size = prompt("Please input the new grid size.", 16);
    if (size <= 100) {
        const grid = document.querySelector("#container");
        grid.innerHTML = "";
        createGrid(size);
    } else if (size > 100) {
        alert("Please input a number no more than 100.");
    }
}

const resizeBtn = document.querySelector("#resize");
resizeBtn.addEventListener("click", resizeGrid);

createGrid(16)