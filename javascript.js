// Actually creates the grid
function createGrid() {
    for (let i = 0; i < 16 * 16; i++) {
        const gridContainer = document.querySelector("#container");
        squareGrid = createSquare()
        gridContainer.appendChild(squareGrid);
    }
}

// Creates the squares with hovering functionality
function createSquare() {
    // Allows css flexbox to fix the grid
    let square = document.createElement("div");
    square.classList.add("square");

    square.addEventListener("mouseenter", ()=>{
        square.style.backgroundColor = "black";
    });
    return square;
}

createGrid()