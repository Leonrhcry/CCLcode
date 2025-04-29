let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function preload() {
    // Load the faceMesh model
    faceMesh = ml5.faceMesh(options);
}
let stars = [];
function setup() {

    let canvas = createCanvas(800, 500); // fullscreen!
    canvas.parent("p5-canvas-container");
    // p.push(new Poi())
}

function draw() {
    background(0);

    for (let i = 0; i < 1; i++) {
        stars.push(new Star())
    }
    for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].display();
    }
    for (let i = stars.length-1; i >= 0; i--) {
        if (stars[i].s > 2) {
            stars.splice(i, 1);
        }
    }
    // clean
    for (let i = 0; i < faces.length; i++) {
        let face = faces[i];
        for (let j = 0; j < face.keypoints.length; j++) {
            let keypoint = face.keypoints[j];
            fill(0, 255, 0);
            noStroke();
            circle(keypoint.x, keypoint.y, 5);
        }
    }
    console.log(stars.length)

}

class Star {
    constructor() {
        this.s = 0.02
        this.a = random(360)
        this.originX = mouseX; // variable point
        let r = random();
        if (r < 0.01) {
            this.type = 'ring';
        } else {
            this.type = 'star';
        }
    }
    update() {
        this.s *= 1.04
        //this.s = map(mouseX, 0, width, 0, 1);
        // keep turning vision
        this.originX = lerp(this.originX, width / 2,0.02);
    }
    display() {
        push();
        translate(this.originX, height / 2);
        rotate(radians(this.a));
        scale(this.s);
        if (this.type == 'star') {
            noStroke();
            fill(255);
            circle(0, 200, 20);
        } else if (this.type == 'ring') {
            stroke(255, 100);
            noFill();
            circle(0, 0, 200);
            circle(0, 0, 100);
            circle(0, 0, 150);
        }
        pop();
    }
}