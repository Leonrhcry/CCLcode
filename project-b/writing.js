function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");
}

function draw() {
    playerselect = parseInt(localStorage.getItem("playerselection"));
    concole.log(playerselect);
}