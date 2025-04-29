let bghue;
let instruments = [];

let beep;

let interacted = false;


function preload() {
    beep = loadSound("assets/beat.mp3")

}

function setup() {
    let w = min(800, windowWidth)
    let canvas = createCanvas(w, 500);
    canvas.parent("p5-canvas-container");
    colorMode(HSB);

    bghue = random(255);


    let a = new Instrument(width / 2, height / 2);
    instruments.push(a)
}

function draw() {
    background(bghue, 180, 27);
    fill(bghue, 180, 30);
    noStroke();
    rect(50, 50, width - 100, height - 100)

    if (interacted == true) {
        for (let i = 0; i < instruments.length; i++) {
            instruments[i].update();
            instruments[i].display();
        }

        fill(255)
        textAlign(CENTER);
        text("click to add instruments", width / 2, height - 20)


    } else {
        fill(255)
        textAlign(CENTER);
        text("click the canvas to begin the experience!", width / 2, height / 2)
    }

}


class Instrument {
    constructor(startX, startY) {
        this.x = startX;
        this.y = startY;
        
        this.possibleSize = [10, 30, 50, 70, 90];
        this.size = random(this.possibleSize);
        this.strokeThickness = this.size;
        this.dia = 1;
        this.diaGoal = 1;
        this.speedX = random(-2, 2);
        this.speedY = random(-2, 2);

        this.myHue = random(0, 50);

        this.myRate = map(this.size, 10, 90, 5, 0.1)
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < this.size / 2 || this.x > width - this.size / 2) {
            this.speedX = -this.speedX;
            beep.rate(this.myRate);
            beep.play()
        }
        if (this.y < this.size / 2 || this.y > height - this.size / 2) {
            this.speedY = -this.speedY;
            beep.rate(this.myRate);
            beep.play()
        }
        this.dia=lerp(this.dia,this.diaGoal,0.2)
    }
    display() {
        push();
        translate(this.x, this.y);
        noStroke();
        //fill(this.myHue, 255, 255);
        noFill();
        stroke(this.myHue, 255, 255);
        strokeWeight(this.strokeThickness);
        circle(0, 0, this.dia);

        pop();
    }
    checkIfClicked() {
        let d = dist(this.x, this.y, mouseX, mouseY);
        if (d<this.size/2) {
            this.myHue = random(100, 200);
            this.diaGoal = this.size * 2;
        }
    }

}
function mousePressed() {
    interacted = true;
    for (let i = 0; i < instruments.length; i++) {
        instruments[i].checkIfClicked();
    }
}


function keyPressed() {

    // beep.rate(random(0.1, 5));
    // beep.play()
    if (key == " ") {
        if (interacted == true && mouseX > 50 && mouseX < width - 50 && mouseY > 50 && mouseY < height - 50) {
            let a = new Instrument(mouseX, mouseY);
            instruments.push(a)
        }
    }


}