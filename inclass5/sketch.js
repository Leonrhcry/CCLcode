function setup() {
  let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");
    s = new Pinwheel(width / 2, height / 2);
}

function draw() {
    background(220);
    
    // get scrolling percentage
    // how much have we scrolled  / entire scrolling space
    let alreadyScrolled = document.getElementById("scrollContainer").scrollTop;
    let entireScrollSpace = document.getElementById("scrollBox").scrollHeight - height;
    let scrollPercentage = alreadyScrolled / entireScrollSpace;
    fill(0)
    textSize(20)
    text(scrollPercentage, 20, 20)
    s.angle = map(scrollPercentage, 0, 1, 0, 360 * 3);
    s.update();
    s.display();
}

class Pinwheel {
    constructor(startX, startY) {
        this.x = startX;
        this.y = startY;
        this.angle = 0;
        this.scaleFactor = 1;
        this.radius = 100;
    }
    update() {

    }
    drawSingleWing() {
        fill(30, 80, 180);
        triangle(0, 0, 0, -this.radius / 2, this.radius / 2, -this.radius / 2);
        fill(220, 150, 30);
        triangle(0, 0, this.radius / 2, -this.radius / 2, this.radius, 0);
    }
    display() {
        push()
        translate(this.x, this.y);

        strokeWeight(5);
        line(0, 0, 0, this.radius * 2)
        noStroke();

        push()
        translate(0, 0);
        rotate(radians(-this.angle));
        for (let i = 0; i < 4; i++) {
            rotate(radians(360/4));
            this.drawSingleWing();
        }
        pop();

        fill("red");
        circle(0, 0, 5);
        pop();
    }
}