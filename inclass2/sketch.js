let basket = [];
function setup() {
  let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");
    for (i = 0; i < 20; i++) {
        let egg = new drawcircle(100, 100);
        basket.push(egg);
    }
}

function draw() {
    background(20,100,200);
    for (i = 0; i < basket.length; i++) {
        basket[i].display();
        basket[i].update();
    }
}

class drawcircle{
    constructor(startX,startY){
        this.x = startX;
        this.y = startY;
        this.diaX = 80;
        this.diaY = 130;
        this.speedx = random(-2,2);
        this.speedy = random(-2, 2);
        this.scaleFactor = random(0.3, 1);
    }
    update() {
        this.x += this.speedx;
        this.y += this.speedy;
        if (this.x <= 0 || this.x >= width) {
            this.speedx = -this.speedx;
        }
        if (this.y <= 0 || this.y >= height) {
            this.speedy = -this.speedy;
        }
    }
    display() {
        push();
        translate(this.x, this.y);
        scale(this.scaleFactor);
        noStroke();
        fill(255, 200);
        //circle(0, 0, this.dia);
        arc(0, 0, this.diaX, this.diaY,PI,2*PI);
        arc(0, 0, this.diaX, this.diaX, 0, PI);
        pop();
    }
}