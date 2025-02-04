// Actually creates the grid
function createGrid() {
    for (let i = 0; i < 16 * 16; i++) {
        const gridContainer = document.querySelector("#container");

        // Allows css flexbox to fix the grid
        let square = document.createElement("div");
        square.classList.add("square");

        gridContainer.appendChild(square);
    }
}

createGrid()