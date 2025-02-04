// Actually creates the grid
function createGrid(size) {
    for (let i = 0; i < size * size; i++) {
        const gridContainer = document.querySelector("#container");
        squareGrid = createSquare(size)
        gridContainer.appendChild(squareGrid);
    }
}

// Creates the squares with hovering functionality
function createSquare(size) {
    // Allows css flexbox to fix the grid
    let square = document.createElement("div");
    square.classList.add("square");

    square.addEventListener("mouseenter", ()=>{
        square.style.backgroundColor = "black";
    });

    // Dynamically computes square size
    const squareSize = 960 / size;

    // Sets the square size
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;

    return square;
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

// Optional stuff to add:
    // Color
    // Opacity
    // Saving
    // Eraser

createGrid(16)