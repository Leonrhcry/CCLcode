/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new RuiyangDancer(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class RuiyangDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    // add properties for your dancer here:
    this.size = 50; 
    this.angle = 0;
    this.armAngleLeft = 0; 
    this.armAngleRight = 0;
    this.legAngle = 0;

    // 控制手臂角度选择的速度
    this.armAngleTimer = 0;
    this.armAngleSpeed = 10;
    this.ellipseangle=0
    this.anglearray = [-60,-30, -20, -10, 0, 10, 20, 30,60];
  }
  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviou
    this.armAngleTimer++;
    if (this.armAngleTimer >= this.armAngleSpeed) {
       this.armAngleLeft = random(this.anglearray);
       this.armAngleRight = random(this.anglearray);
       this.armAngleTimer = 0;
    }

    this.legAngle = cos(this.angle) * 10;
    this.angle += 0.05;

    this.y += sin(this.angle) * 2;
    this.ellipseangle += 0.07;
  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x, this.y);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️
    fill(255, 224, 189);
    stroke(255,248, 220);
    strokeWeight(3);
    ellipse(0, -40, 30, 30);  // 头部
    line(0, - 25, 0, 0);  // 身体的连接线

    // 画出舞者的身体
    fill(155, 224, 189);
    rect(- 10, - 10, 20, 40);  // 身体

    // 画出右手
    push()
    rotate(radians(this.armAngleRight));  // 旋转右手
    line(5, -10, 30, 0);  // 右手
    pop()

    // 画出左手
    push();
    rotate(radians(-this.armAngleLeft));  // 旋转左手
    line(-5, -10, -30, 0);  // 左手
    pop();

    // 画出腿部
    push();
    rotate(radians(this.legAngle));  // 旋转右腿
    line(5, 30, 20, 40);  // 右腿
    pop();

    push();
    rotate(radians(-this.legAngle));  // 旋转左腿
    line(-5, 30, -20, 40);  // 左腿
    pop();

    push();
    noStroke();
    rotate(this.ellipseangle);
    ellipse(0, -80, 40, 30);
    ellipse(0, 80, 40, 30);
    ellipse(80, 0, 40, 30);
    ellipse(-80, 0, 40, 30);
    pop();

    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    //this.drawReferenceShapes()

    pop();
  }
  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/