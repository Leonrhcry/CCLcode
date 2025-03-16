let scpX, scpY;
let time = 0;
let absorptionCompleteFrame = null;
let blackoutStartFrame = null;
// �ƹ�״̬
let bulbIntensity = 0, uvIntensity = 0, xrayIntensity = 0;
let bulbTarget = 0, uvTarget = 0, xrayTarget = 0;
let blackAlpha = 0; // ����͸����
let absorbingLight = false; // ��¼�Ƿ��������չ�Դ
let fadeToBlack = false;
let absorptionCompleteTime = null; // ��¼��Դ������ɵ�ʱ��
let blackoutStartTime = null; // ��¼�ڰ���ʼ��ʱ��
let blackoutDuration = 60; // �ڰ�����ʱ�䣨2�룬60֡��
let waitBeforeBlackout = 30; // �ȴ�ʱ�䣨1�룬30֡��
// ��¼ SCP-XXXX �Ƿ���롰��̬���ȶ���״̬
let unstableForm = false;
let noiseOffsets = [];

let morseCodePoints = []; // �洢Ħ˹�����
let lastMorseGeneration = 0; // ��¼�ϴ�Ħ˹��������ʱ��
let morseInterval = 500; // ����Ħ˹�����ʱ���������룩
// ��¼Ħ˹������Ϣ
//let morseCodeMessages = [];
//let morseLifetime = 5000; // Ħ˹�������ʱ�䣨5�룩
let morseIndex = 0; // ��ǰѡ���Ħ˹��������
let morseMode = false; // �Ƿ����Ħ˹����״̬
let morseLifetime = 300; // Ħ˹�������ʱ�䣨10�룬300֡��
let morseCycleInterval = 150; // ���ɼ����5�룬150֡��
let lastMorseCycle = 0; // ��¼�ϴ�Ħ˹�������ɵ�֡��
// Ԥ����Ħ˹������Ϣ
const morseLibrary = [
    { text: "HUNGRY", code: ".... ..- -. --. .-. -.--" },
    { text: "FOOD", code: "..-. --- --- -.." },
    { text: "YOU", code: "-.-- --- ..-" },
    { text: "LIKE", code: ".-.. .. -.- ." },
    { text: "MORE", code: "-- --- .-. ." }
];

let currentMorse = morseLibrary[morseIndex]; // ��ǰĦ˹��Ϣ

let jumpScareTriggered = false; // �Ƿ񴥷� SCP-XXXX ����
let scareAlpha = 0; // �ֲ�����͸����
let scareTimer = 0; // ��¼ SCP-XXXX �����Ŀ�ʼʱ��
let scareDuration = 120; // 4�룬120֡

hideUI = false;

// SCP-XXXX Ŀ��λ��
let targetX = null, targetY = null;
let movingToLight = false; // �Ƿ������ƶ�����Դ
let absorbedLight = false; // �Ƿ��������չ�Դ
let buttonVisible = true; // **���ư�ť�Ƿ�ɼ�**
// �ƹⰴť������ʹ�С
let bulbButton = { x: 700, y: 90, w: 80, h: 30, label: "Bulb" };
let uvButton = { x: 700, y: 240, w: 80, h: 30, label: "UV" };
let xrayButton = { x: 700, y: 390, w: 80, h: 30, label: "X-Ray" };

function setup() {
    //createCanvas(800, 500);
    scpX = width / 3;
    scpY = height / 2;
    let canvas = createCanvas(800, 500);
    canvas.id("p5-canvas");
    canvas.parent("p5-canvas-container");
    // ��ʼ��ÿ�����ֵ�����ƫ����
    for (let i = 0; i < 10; i++) {
        noiseOffsets[i] = random(100);
    }

    frameRate(30);

}

function draw() {
    background(0);
    fill(144, 200, 50);
    if (!hideUI) {
        text("Feed SCP-XXXX with light and observe its changes.", 400, 10);
        drawMorseDictionary();
    }

    if (jumpScareTriggered) {
        if (frameCount - scareStartFrame < scareDuration) {
            scareAlpha = min(scareAlpha + 10, 255);
            drawScaryFace(scareAlpha);
            return;
        } else {
            jumpScareTriggered = false;
            scareAlpha = 0;
            resetGame();
            return;
        }
    }
    // ���ɺڰ���ɢ����
    for (let i = 0; i < width; i += 5) {
        for (let j = 0; j < height; j += 5) {
            let distance = dist(i, j, width / 2, height / 2);
            let darkness = map(distance, 0, width / 2, 255, 0);
            fill(0, 0, 0, darkness);
            noStroke();
            rect(i, j, 5, 5);
        }
    }

    // ���� SCP-XXXX �˶��߼�
    updateSCPXXXX();

    // �� SCP-XXXX
    push();
    translate(scpX, scpY);
    drawSCPXXXX(0, 0, 100);
    pop();

    if (morseMode) {
        if (frameCount - lastMorseCycle > morseCycleInterval) {
            generateMorseCode();
            lastMorseCycle = frameCount;
        }
        drawMorseCode();
    }
    // ���µƹ�ǿ��
    bulbIntensity = lerp(bulbIntensity, bulbTarget, 0.1);
    uvIntensity = lerp(uvIntensity, uvTarget, 0.1);
    xrayIntensity = lerp(xrayIntensity, xrayTarget, 0.1);

    // ������ɢ������ʱ���С��
    drawLightGlow(650, 100, color(255, 204, 0, bulbIntensity * 100), bulbIntensity * 150);
    drawLightGlow(660, 250, color(128, 0, 255, uvIntensity * 100), uvIntensity * 200);
    drawLightGlow(655, 400, color(0, 255, 255, xrayIntensity * 100), xrayIntensity * 250);

    // ������
    drawBulb(650, 100, color(255, 204, 0, bulbIntensity * 255));
    drawUVLamp(660, 250, color(128, 0, 255, uvIntensity * 255));
    drawXRayLamp(655, 400, color(0, 255, 255, xrayIntensity * 255));
    if (buttonVisible) {
        drawButton(bulbButton);
        drawButton(uvButton);
        drawButton(xrayButton);
    }
    stroke(255);
    line(690, 0, 690, height);
    // �������Ч��
    if (fadeToBlack) {
        blackAlpha = min(blackAlpha + 5, 255);
        fill(0, 0, 0, blackAlpha);
        rect(0, 0, width, height);
        if (blackAlpha >= 255) {
            fadeToBlack = false;
            blackAlpha = 0;
        }
    }
    if (jumpScareTriggered) {
        hideUI = true;
    } else {
        hideUI = false;
    }
}
// **���ư�ť**
function drawButton(button) {
    if (!button || button.w === undefined) return; // **��ֹ button.w Ϊ��**

    fill(200);
    rect(button.x, button.y, button.w, button.h, 5);
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(button.label, button.x + button.w / 2, button.y + button.h / 2);
}

function mousePressed() {
    if (!buttonsVisible) return; // **��ť����ʱ��ִ�е��**

    if (isInside(mouseX, mouseY, bulbButton)) toggleLight("bulb");
    if (isInside(mouseX, mouseY, uvButton)) toggleLight("uv");
    if (isInside(mouseX, mouseY, xrayButton)) toggleLight("xray");
}

function mousePressed() {
    if (isInside(mouseX, mouseY, bulbButton)) toggleLight("bulb");
    if (isInside(mouseX, mouseY, uvButton)) toggleLight("uv");
    if (isInside(mouseX, mouseY, xrayButton)) toggleLight("xray");
}

// �������Ƿ��ڰ�ť�ڲ�
function isInside(mx, my, button) {
    return mx > button.x && mx < button.x + button.w &&
        my > button.y && my < button.y + button.h;
}

// SCP-XXXX ����
function drawSCPXXXX(cx, cy, size) {
    fill(50);
    stroke(200);
    strokeWeight(2);

    let points = 5;
    let angleOffset = -HALF_PI;

    beginShape();
    for (let k = 0; k < points * 2; k++) {
        let baseRadius = k % 2 == 0 ? size : size / 2;

        // ���ֱ�ø���Ť��
        let noiseFactor = noise(noiseOffsets[k] + frameCount * 0.02) * 2 - 1;
        let distortion = unstableForm ? noiseFactor * 20 : 0;

        let radius = baseRadius + distortion;
        let angle = map(k, 0, points * 2, 0, TWO_PI) + angleOffset;

        let x = cx + cos(angle) * radius;
        let y = cy + sin(angle) * radius;
        vertex(x, y);
    }
    endShape(CLOSE);

    // �� SCP-XXXX ���۾�
    fill(255);
    ellipse(cx - size * 0.25, cy - size * 0.25, 10, 15);
    ellipse(cx + size * 0.25, cy - size * 0.25, 10, 15);

    // **��Ͷ��������¿��ϣ�**
    let mouthOpen = map(sin(frameCount * 0.1), -1, 1, 10, 30); // ��ʹ�С��ʱ��仯
    noFill();
    stroke(255);
    strokeWeight(2);
    arc(cx, cy + size * 0.2, 50, mouthOpen, 0, PI); // ��Ͷ���

    // **������**
    for (let i = -2; i <= 2; i++) {
        let tx = cx + i * 10;
        let ty1 = cy + size * 0.2 + 5;
        let ty2 = cy + size * 0.2 + mouthOpen * 0.8; // ���ݸ�������ſ����ȱ仯
        line(tx, ty1, tx + 5, ty2);
        line(tx, ty1, tx - 5, ty2);
    }
}

function updateSCPXXXX() {
    if (movingToLight) {
        // SCP-XXXX �ƶ�����Դ
        scpX = lerp(scpX, targetX - 70, 0.03);
        scpY = lerp(scpY, targetY, 0.03);

        let d = dist(scpX, scpY, targetX - 70, targetY);
        if (d < 10) {
            // �����չ�Դ
            if (bulbTarget > 0) bulbTarget -= 0.02;
            if (uvTarget > 0) uvTarget -= 0.02;
            if (xrayTarget > 0) xrayTarget -= 0.02;

            if (bulbTarget <= 0 && uvTarget <= 0 && xrayTarget <= 0) {
                movingToLight = false;
                absorbedLight = true;
                if (scpY < 200) {
                    unstableForm = true; // ������̬���ȶ�״̬
                } else if (targetY == 250) { // ֻ�� UV ������ʱ����Ħ˹����

                    morseMode = true; // ����Ħ˹����ģʽ
                    morseIndex = (morseIndex + 1) % morseLibrary.length; // ѡ����һ��Ħ˹����
                    morseCodePoints = []; // ��յ�ǰĦ˹�㣬׼����һ��
                } else if (targetY == 400) {
                    // ���� SCP-XXXX ������̬
                    jumpScareTriggered = true;
                    scareStartFrame = frameCount;
                    return;

                }
                absorptionCompleteTime = millis();
            }
        }
    } else if (absorbedLight) {
        // ����ڰ�ǰ����̬�������ȶ�
        if (frameCount - absorptionCompleteFrame > waitBeforeBlackout) {
            fadeToBlack = true;
            absorbedLight = false;
            blackoutStartFrame = frameCount;
        }
    } else if (fadeToBlack) {
        if (frameCount - blackoutStartFrame > blackoutDuration) {
            fadeToBlack = false;
            unstableForm = false;
        }
    } else {

        // ����״̬�������ƶ�
        let newX = noise(time) * width * 0.6 + width * 0.2;
        let newY = noise(time + 100) * height * 0.6 + height * 0.2;
        scpX = newX;
        scpY = newY;
        if (scpX + 50 > 690) scpX = 690 - 50;
        time += 0.01;
    }
}



// ����ͨ����
function drawBulb(x, y, lightColor) {
    fill(lightColor);
    stroke(200);
    ellipse(x, y, 40, 30);
    fill(150);
    rect(x + 20, y - 5, 20, 10);
}

// �������ߵ�
function drawUVLamp(x, y, lightColor) {
    fill(150);
    rect(x - 10, y - 20, 40, 20);
    fill(lightColor);
    ellipse(x + 10, y - 10, 10, 40);
}

// �� X ���ߵ�
function drawXRayLamp(x, y, lightColor) {
    fill(150);
    rect(x - 15, y - 25, 50, 30);
    fill(lightColor);
    ellipse(x - 10, y - 10, 20, 50);
}

// ������ɢ�����ᳬ�� x=690��
function drawLightGlow(x, y, lightColor, radius) {
    noStroke();
    for (let r = radius; r > 0; r -= 10) {
        let alpha = map(r, 0, radius, 0, lightColor.levels[3]);
        let leftX = max(x - r, 0);
        let rightX = min(x + r, 690);
        fill(lightColor.levels[0], lightColor.levels[1], lightColor.levels[2], alpha);
        ellipse((leftX + rightX) / 2, y, rightX - leftX, r);
    }
}

// **�ƹ��л�**
function toggleLight(type) {
    if (type === "bulb") {
        bulbTarget = bulbTarget > 0 ? 0 : 1;
        targetX = 650;
        targetY = 100;
    } else if (type === "uv") {
        uvTarget = uvTarget > 0 ? 0 : 1;
        targetX = 660;
        targetY = 250;
    } else if (type === "xray") {
        xrayTarget = xrayTarget > 0 ? 0 : 1;
        targetX = 655;
        targetY = 400;
    }
    movingToLight = true;
    if (type === "xray") {
        buttonsVisible = false; // **���ذ�ť**
    }
}
// �� SCP-XXXX �ƶ�����Դ
function moveSCPToLight(x, y) {
    targetX = x;
    targetY = y;
    movingToLight = true;
}
function generateMorseCode() {
    morseCodePoints = []; // �����һ�ֵ�Ħ˹����

    for (let i = 0; i < 5; i++) { // ÿ������ 5 ��Ħ˹����
        let entry = random(morseLibrary); // ���ѡȡһ��Ħ˹����
        let x = random(100, width - 120); // ��� x λ��
        let y = random(100, height - 100); // ��� y λ��
        morseCodePoints.push({ text: entry.code, x, y, alpha: 255, startFrame: frameCount });
    }
}


function drawMorseCode() {
    for (let i = morseCodePoints.length - 1; i >= 0; i--) {
        let p = morseCodePoints[i];
        let elapsedFrames = frameCount - p.startFrame;

        if (elapsedFrames > morseLifetime) {
            morseCodePoints.splice(i, 1); // ��ʱ�Ƴ�
            continue;
        }

        let fadeAmount = map(elapsedFrames, 0, morseLifetime, 255, 0); // �𽥵���
        fill(255, 0, 0, fadeAmount);
        textSize(24);
        textAlign(CENTER, CENTER);
        text(p.text, p.x, p.y);
    }
}

// **����Ħ˹������ձ�**
function drawMorseDictionary() {
    if (hideUI) return; // **��� UI �����أ�����������������ʾ**

    fill(255);
    textSize(16);
    textAlign(LEFT, TOP);
    let startX = 20, startY = 20;

    text("Morse Code Dictionary:", startX, startY);
    for (let i = 0; i < morseLibrary.length; i++) {
        let entry = morseLibrary[i];
        text(entry.text + ": " + entry.code, startX, startY + 20 * (i + 1));
    }
}

function drawScaryFace(alpha) {
    push();
    translate(width / 2, height / 2);

    // SCP-XXXX ������̬
    noFill();
    stroke(255, alpha);
    strokeWeight(5);

    // ����Ť�����������
    beginShape();
    for (let i = 0; i < 5; i++) {
        let angle = PI * 0.4 * i + random(-0.2, 0.2); // �����ƫ��
        let x = cos(angle) * (width * 0.6 + random(-20, 20));
        let y = sin(angle) * (width * 0.6 + random(-20, 20));
        vertex(x, y);
    }
    endShape(CLOSE);

    // ���۾�
    fill(255, alpha);
    noStroke();
    ellipse(-50, -50, 100, 100);
    ellipse(50, -50, 100, 100);

    // �����ѿ�����ͣ����м���
    fill(255, alpha);
    beginShape();
    for (let i = -80; i < 80; i += 20) {
        let yOffset = sin(i * 0.1) * 20;
        vertex(i, 50 + yOffset);
        vertex(i + 10, 80);
    }
    endShape();

    pop();
}

function resetGame() {
    // ���³�ʼ�����б���
    scpX = width / 3;
    scpY = height / 2;
    blackAlpha = 0;
    fadeToBlack = false;
    movingToLight = false;
    absorbedLight = false;
    unstableForm = false;
    bulbIntensity = uvIntensity = xrayIntensity = 0;
    bulbTarget = uvTarget = xrayTarget = 0;
    morseMode = false;
    jumpScareTriggered = false;
    scareAlpha = 0;
    scareTimer = 0;
    buttonsVisible = true;
}



