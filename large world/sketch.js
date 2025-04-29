let paperImg;
let imgW, imgH;
let particles = [];
let numparticles = 50;
let worldwidth = 2000;
let worldheight = 2000;
let worldX = 0;
let worldY = 0;
let maincharacter
function preload() {
    paperImg = loadImage("assets/Paper-Texture-4.jpg");
    fishImg = loadImage("assets/alexfish.png");
}
function setup() {
  let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");
    //imgW = paperImg.width;
    //imgH = paperImg.height;
    for (let i = 0; i < numparticles; i++) {
        particles.push(new Particle())
    }
    maincharacter = new Fish();
}

function draw() {
    background(220);
    image(paperImg, worldX, worldY, worldwidth, worldheight);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].display();
    }
    maincharacter.update();
    maincharacter.display();

    let navigatespeed=4
    if (keyIsPressed == true) {
        if (key == 'a') {
            worldX += navigatespeed;
        } else if (key == 'd') {
            worldX -= navigatespeed;
        } else if (key == 'w') {
            worldY += navigatespeed;
        } else if (key == 's') {
            worldY -= navigatespeed;
        }
    }
}

class Particle {
    constructor() {
        this.x = random(0, worldwidth);
        this.y = random(0, worldheight);
        this.speedX = random(-2, 2);
        this.dia = 20
    }
    update() {
        this.x += this.speedX;

        // bounce
        if (this.x > worldwidth - this.dia / 2 || this.x < this.dia / 2) {
            this.speedX = -this.speedX;
        }
    }
    display() {
        push();
        translate(this.x, this.y);

        circle(0, 0, this.dia);

        pop();
    }
}

class Fish {
    constructor() {
        this.x = 200;
        this.y = 200;
        this.speed = 4;
        this.angle = 0;
    }
    update() {
        
    }
    display() {
        push();
        translate(this.x, this.y);
        image(fishImg, 0, 0);
        fill("red");
        circle(0, 0, 5);
        pop();
    }
    moveRight() {
        this.x += this.speed
        worldX -= this.speed;
        this.angle = 90;
    }
}