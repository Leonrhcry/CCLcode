let stararray = [];
let backstar = [];
function setup() {
  let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");
    colorMode(HSB);
    for (let i = 0; i < 15; i++) {
        stararray.push(new star(random(0,width), 0));
    }
    for (let j = 0; j < 50; j++) {
        backstar.push(new backgroundstar(random(0, width), random(0, height)));
    }
}

function draw() {
    background(0);

    for (let i = 0; i < stararray.length; i++) {
        stararray[i].update();
        stararray[i].display();
    }
    for (let i = stararray.length - 1; i >= 0; i--) {
        if (!stararray[i].onCanvas) {
            stararray.splice(i, 1);
            stararray.push(new star(random(0,width), 0));
        }
    }
    for (let j = 0; j < backstar.length; j++) {
        backstar[j].update();
        backstar[j].display();
        backstar[j].change = false;
    }
}

class star {
    constructor(startX, startY) {
        this.x = startX;
        this.y = startY;
        this.dia = 10;
        this.speedX = random(2,4);
        this.speedY = random(3,5);
        this.tailLength = random(10, 30);
        this.onCanvas = true;
        this.tail = [];
        this.lifeSpan = random(150, 200);
        this.age = 0;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY -= 0.005;
        this.tail.push([this.x, this.y]);

        if (this.tail.length > this.tailLength) {
            this.tail.shift();
        }
        if (this.x > width || this.y > height) {
            this.onCanvas = false;
        }
        this.age+=0.5;

        if (this.age > this.lifeSpan) {
            this.onCanvas = false;
        }
    }
    display() {
        push();
        for (let i = 0; i < this.tail.length; i++) {
            let tailSize = map(i, 0, this.tail.length, this.dia * 0.5, this.dia);
            let tailOpacity = map(i, 0, this.tail.length, 255, 0);
            fill(210-i, 255, 255, tailOpacity);
            noStroke();
            ellipse(this.tail[i][0], this.tail[i][1], tailSize, tailSize);
        }
        
        pop();
    }
}

class backgroundstar {
    constructor(startX, startY) {
        this.x = startX;
        this.y = startY;
        this.dia = 2;
        this.opacity = 255;
        this.change=false
    }
    update() {
        if (mouseIsPressed) {
            this.opacity = 210;
        } else {
            this.opacity = 255;
        }
        
    }
    display() {
        fill(this.opacity, 255, 255);
        noStroke();
        circle(this.x, this.y, this.dia);
    }
}

//function mousePressed() {
//    for (let j = 0; j < backstar.length; j++) {
//        backstar[j].change = true;
//        backstar[j].update();
        
//    }
//}