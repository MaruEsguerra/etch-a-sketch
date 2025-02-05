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
    const squareSize = 664 / size;

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
    square.dataset.shade = "0";

    document.addEventListener("mousedown", ()=>{
        isDrawing = true;
    });

    document.addEventListener("mouseup", ()=>{
        isDrawing = false;
    });

    function darken(element) {
        let shade = parseInt(element.dataset.shade);
        if (shade < 10) {
            shade++;
            element.dataset.shade = shade;
            element.style.backgroundColor = `rgba(0, 0, 0, ${shade * 0.1})`;
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

// Ensures UI is working
function initializeControls() {
    // Sets up buttons
    document.querySelectorAll(".mode-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            document.querySelectorAll(".mode-btn").forEach(btn =>
                btn.classList.remove("active")
            );

            e.target.classList.add("active");

            drawingState.mode = e.target.id.replace("-mode", "");

            const grid = document.querySelector("#container");
            const size = Math.sqrt(grid.children.length);
            grid.innerHTML = "";
            createGrid(size);
        });
    });

    // Sets up the color picker
    const colorPicker = document.querySelector("#color-picker");
    colorPicker.addEventListener("input", (e) => {
        // Changes color when user does
        drawingState.color = e.target.value;
    });

    // Sets up eraser
    document.querySelector("#eraser").addEventListener("click", ()=>{
        drawingState.color = "#FFFFFF";
    });

    // Allows usage of grid size slider
    const slider = document.querySelector("#grid-size");
    const sizeDisplay = document.querySelector("#size-value");

    slider.addEventListener("input", (e) => {
        const size = e.target.value;
        sizeDisplay.textContent = `${size} x ${size}`;
        createGrid(size)
    });

    // Allows grid clearing
    document.querySelector("#clear-grid").addEventListener("click", ()=>{
        const squares = document.querySelectorAll(".square");
        squares.forEach(square => {
            square.style.backgroundColor = "";
            if (square.dataset.shade) {
                square.dataset.shade = "0";
            }
        });
    });

    // Allows save to work
    document.querySelector("#save-drawing").addEventListener("click", saveDrawing);
}

// Function to actually save drawing
function saveDrawing() {
    const grid = document.querySelector("#container");

    // Initializes a clone using canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Makes sure the size is correct
    canvas.width = grid.offsetWidth;
    canvas.height = grid.offsetHeight;

    // Fills background squares without color
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Starts the clone
    const squares = document.querySelectorAll(".square");
    squares.forEach(square => {
        const rect = square.getBoundingClientRect();
        const color = square.style.backgroundColor || "white";
        ctx.fillStyle = color;
        ctx.fillRect(
            rect.left - grid.getBoundingClientRect().left,
            rect.top - grid.getBoundingClientRect().top,
            rect.width,
            rect.height
        );
    });

    // Creates download link
    const link = document.createElement("a");
    link.download = "etch-a-sketch.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

createGrid(16);
initializeControls();