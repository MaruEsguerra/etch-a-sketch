// Tracks current drawing settings
const drawingState = {
    mode: "solid",
    color: "#000000",
    isDrawing: false
}

// Creates the grid and squares
function createGrid(size) {
    const gridContainer = document.querySelector("#container");
    gridContainer.innerHTML = "";

    // Smoothens experience changing the grid w/ batch DOM updates
    const fragment = document.createDocumentFragment();

    // Calculates square size
    const squareSize = 664/size;

    for (let i = 0; i < size * size; i++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;
        fragment.appendChild(square);
    }

    // Adds all the squares at once
    gridContainer.appendChild(fragment);

    // Allows usage of event listeners to entire grid instead of each individual square
    setupDrawingEvents(gridContainer);
}

// Drawing event delegation for entire document
function setupDrawingEvents(container) {
    document.addEventListener("mousedown", () => {
        drawingState.isDrawing = true;
    });

    document.addEventListener("mouseup", () => {
        drawingState.isDrawing = false;
    });

    // Safety nets for hovering mouse bug
    document.addEventListener("mouseleave", () => {
        drawingState.isDrawing = false;
    });

    document.addEventListener("mouseenter", () => {
        drawingState.isDrawing = false;
    });

    container.addEventListener("mouseover", (e) => {
        // Checks if user stopped drawing and returns
        if (!drawingState.isDrawing || !e.target.classList.contains("square")) return;
        applyColor(e.target);
    });

    container.addEventListener("mousedown", (e) => {
        if (!e.target.classList.contains("square")) return;
        applyColor(e.target);
    });
}

// Handles the different drawing modes
function applyColor(square) {
    switch (drawingState.mode) {
        case "rainbow":
            square.style.backgroundColor = getRandomColor();
            break;
        case "shade":
            applyShading(square);
            break;
        default:
            square.style.backgroundColor = drawingState.color;
    }
}

// Vibrant random color generation
function getRandomColor() {
    // Uses HSL
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70 + Math.random() * 30;
    const lightness = 45 + Math.random() * 10;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Progressive darkening that accounts for chosen color
function applyShading(square) {
    // Initializes shade level
    let shade = parseInt(square.dataset.shade || "0");
    if (shade >= 10) return;

    shade++;
    square.dataset.shade = shade;

    // Converts color to RGBA for shading
    if (shade === 1) {
        // Parses the color into rgb
        let color = drawingState.color;
        if (color.startsWith("#")) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            square.dataset.baseColor = `${r},${g},${b}`;
        } else {
            square.dataset.baseColor = "0,0,0";
        }
    }

    const baseColor = square.dataset.baseColor;
    square.style.backgroundColor = `rgba(${baseColor}, ${shade * 0.1})`;
}

// Initializes the UI
function initializeControls() {
    // Sets up color mode buttons
    document.querySelectorAll(".mode-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            document.querySelectorAll(".mode-btn").forEach(btn =>
                btn.classList.remove("active")
            );
            drawingState.mode = e.target.id.replace("-mode", "");
        });
    });

    // Sets up color picker
    const colorPicker = document.querySelector("#color-picker");
    colorPicker.addEventListener("input", (e) => {
        drawingState.color = e.target.value;
    });

    // Sets up universal eraser
    document.querySelector("#eraser").addEventListener("click", () => {
        const previousMode = drawingState.mode;
        drawingState.mode = "solid";
        drawingState.color = "#FFFFFF";

        // Ensures user knows eraser is being used
        document.querySelector("#eraser").classList.add("active");
    });

    // Allows and optimizes slider performance
    const slider = document.querySelector("#grid-size");
    const sizeDisplay = document.querySelector("#size-value");
    let debounceTimeout;

    slider.addEventListener("input", (e) => {
        // Updates grid size label
        const size = e.target.value;
        sizeDisplay.textContent = `${size} x ${size}`;

        // Updates actual grid
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            createGrid(size);
        }, 150);
    });

    // Sets up clear and save buttons
    document.querySelector("#clear-grid").addEventListener("click", () => {
        const squares = document.querySelectorAll(".square");
        squares.forEach(square => {
            square.style.backgroundColor = "";
            delete square.dataset.shade;
            delete square.dataset.baseColor;
        });
    });

    document.querySelector("save-drawing").addEventListener("click", saveDrawing);
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