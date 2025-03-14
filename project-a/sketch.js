/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let scpX, scpY;
let time = 0;
let oldtime;
// 灯光状态
let bulbIntensity = 0, uvIntensity = 0, xrayIntensity = 0;
let bulbTarget = 0, uvTarget = 0, xrayTarget = 0;
let blackAlpha = 0; // 黑屏透明度
let absorbingLight = false; // 记录是否正在吸收光源
let fadeToBlack = false;
let absorptionCompleteTime = null; // 记录光源吸收完成的时间
let blackoutStartTime = null; // 记录黑暗开始的时间
let blackoutDuration = 2000; // 黑暗持续时间（2秒）
let waitBeforeBlackout = 1000; // 等待时间（1秒）
// 记录 SCP-XXXX 是否进入“形态不稳定”状态
let unstableForm = false;
let noiseOffsets = [];

let morseCodePoints = []; // 存储摩斯电码点
let lastMorseGeneration = 0; // 记录上次摩斯电码生成时间
let morseInterval = 500; // 生成摩斯电码的时间间隔（毫秒）
// 记录摩斯电码消息
//let morseCodeMessages = [];
//let morseLifetime = 5000; // 摩斯电码持续时间（5秒）
let morseIndex = 0; // 当前选择的摩斯电码索引
let morseMode = false; // 是否进入摩斯电码状态
let lastMorseCycle = 0; // 记录上次摩斯电码生成的时间
let morseCycleInterval = 5000; // 3秒钟循环一次
let morseLifetime = 10000; // 摩斯电码持续时间（10秒）
// 预定义摩斯电码信息（攻击性）
const morseLibrary = [
    { text: "DANGER", code: "-.. .- -. --. . .-." },
    { text: "FEAR", code: "..-. . .- .-." },
    { text: "RUN", code: ".-. ..- -." },
    { text: "HIDE", code: ".... .. -.. ." },
    { text: "HELP", code: ".... . .-.. .--." }
];
let currentMorse = morseLibrary[morseIndex]; // 当前摩斯信息

let jumpScareTriggered = false; // 是否触发 SCP-XXXX 贴脸
let scareAlpha = 0; // 恐怖脸的透明度
let scareTimer = 0; // 记录 SCP-XXXX 贴脸的开始时间
let scareDuration = 4000; // 贴脸恐怖图持续时间（4 秒）



// SCP-XXXX 目标位置
let targetX = null, targetY = null;
let movingToLight = false; // 是否正在移动到光源
let absorbedLight = false; // 是否正在吸收光源
let buttonVisible = true; // **控制按钮是否可见**
// 灯光按钮的坐标和大小
let bulbButton = { x: 700, y: 90, w: 80, h: 30, label: "Bulb" };
let uvButton = { x: 700, y: 240, w: 80, h: 30, label: "UV" };
let xrayButton = { x: 700, y: 390, w: 80, h: 30, label: "X-Ray" };
//let bulbButton, uvButton, xrayButton; // 存储按钮引用


function setup() {
    let canvas = createCanvas(800, 500);
    canvas.id("p5-canvas");
    canvas.parent("p5-canvas-container");
    scpX = width / 3;
    scpY = height / 2;

    // 初始化每个触手的噪声偏移量
    for (let i = 0; i < 10; i++) {
        noiseOffsets[i] = random(100);
    }

    frameRate(30);


}

function draw() {
    background(0);
    fill(144, 200, 50);
    text("Feed SCP-XXXX with light and observe its changes.", 400, 10);
    // 绘制摩斯电码对照表
    drawMorseDictionary();
    if (jumpScareTriggered) {

        if (millis() - scareTimer < scareDuration) {
            scareAlpha = min(scareAlpha + 10, 255);
            drawScaryFace(scareAlpha);
            return; // 直接返回，阻止绘制其他内容
        } else {
            // 贴脸持续时间结束，允许游戏重置
            jumpScareTriggered = false;
            scareAlpha = 0;
            resetGame();
            return;
        }
    }

    // 生成黑暗扩散背景
    for (let i = 0; i < width; i += 5) {
        for (let j = 0; j < height; j += 5) {
            let distance = dist(i, j, width / 2, height / 2);
            let darkness = map(distance, 0, width / 2, 255, 0);
            fill(0, 0, 0, darkness);
            noStroke();
            rect(i, j, 5, 5);
        }
    }

    // 处理 SCP-XXXX 运动逻辑
    updateSCPXXXX();

    // 画 SCP-XXXX
    push();
    translate(scpX, scpY);
    drawSCPXXXX(0, 0, 100);
    pop();

    if (morseMode) {
        let now = millis();

        // 每隔一段时间清空并重新生成摩斯电码
        if (now - lastMorseCycle > morseCycleInterval) {
            generateMorseCode();
            lastMorseCycle = now;
        }

        drawMorseCode();
    }

    // 更新灯光强度
    bulbIntensity = lerp(bulbIntensity, bulbTarget, 0.1);
    uvIntensity = lerp(uvIntensity, uvTarget, 0.1);
    xrayIntensity = lerp(xrayIntensity, xrayTarget, 0.1);

    // 画光扩散（吸收时会变小）
    drawLightGlow(650, 100, color(255, 204, 0, bulbIntensity * 100), bulbIntensity * 150);
    drawLightGlow(660, 250, color(128, 0, 255, uvIntensity * 100), uvIntensity * 200);
    drawLightGlow(655, 400, color(0, 255, 255, xrayIntensity * 100), xrayIntensity * 250);

    // 画灯泡
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
    // 处理黑屏效果
    if (fadeToBlack) {
        blackAlpha = min(blackAlpha + 5, 255);
        fill(0, 0, 0, blackAlpha);
        rect(0, 0, width, height);
        if (blackAlpha >= 255) {
            fadeToBlack = false;
            blackAlpha = 0;
        }
    }
}
// **绘制按钮**
function drawButton(button) {
    if (!button || button.w === undefined) return; // **防止 button.w 为空**

    fill(200);
    rect(button.x, button.y, button.w, button.h, 5);
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(button.label, button.x + button.w / 2, button.y + button.h / 2);
}

function mousePressed() {
    if (!buttonsVisible) return; // **按钮隐藏时不执行点击**

    if (isInside(mouseX, mouseY, bulbButton)) toggleLight("bulb");
    if (isInside(mouseX, mouseY, uvButton)) toggleLight("uv");
    if (isInside(mouseX, mouseY, xrayButton)) toggleLight("xray");
}

function mousePressed() {
    if (isInside(mouseX, mouseY, bulbButton)) toggleLight("bulb");
    if (isInside(mouseX, mouseY, uvButton)) toggleLight("uv");
    if (isInside(mouseX, mouseY, xrayButton)) toggleLight("xray");
}

// 检查鼠标是否在按钮内部
function isInside(mx, my, button) {
    return mx > button.x && mx < button.x + button.w &&
        my > button.y && my < button.y + button.h;
}

// SCP-XXXX 生成
function drawSCPXXXX(cx, cy, size) {
    fill(50);
    stroke(200);
    strokeWeight(2);

    let points = 5;
    let angleOffset = -HALF_PI;

    beginShape();
    for (let k = 0; k < points * 2; k++) {
        let baseRadius = k % 2 == 0 ? size : size / 2;

        // 触手变得更加扭曲
        let noiseFactor = noise(noiseOffsets[k] + frameCount * 0.02) * 2 - 1;
        let distortion = unstableForm ? noiseFactor * 20 : 0;

        let radius = baseRadius + distortion;
        let angle = map(k, 0, points * 2, 0, TWO_PI) + angleOffset;

        let x = cx + cos(angle) * radius;
        let y = cy + sin(angle) * radius;
        vertex(x, y);
    }
    endShape(CLOSE);

    // 画 SCP-XXXX 的眼睛
    fill(255);
    ellipse(cx - size * 0.25, cy - size * 0.25, 10, 15);
    ellipse(cx + size * 0.25, cy - size * 0.25, 10, 15);

    // 画咧开的笑脸
    noFill();
    stroke(255);
    strokeWeight(2);
    arc(cx, cy + size * 0.2, 50, 30, 0, PI);

    // 画尖牙
    for (let i = -2; i <= 2; i++) {
        let tx = cx + i * 10;
        let ty1 = cy + size * 0.2 + 5;
        let ty2 = cy + size * 0.2 + 15;
        line(tx, ty1, tx + 5, ty2);
        line(tx, ty1, tx - 5, ty2);
    }
}

function updateSCPXXXX() {
    if (movingToLight) {
        // SCP-XXXX 移动到光源
        scpX = lerp(scpX, targetX - 70, 0.03);
        scpY = lerp(scpY, targetY, 0.03);

        let d = dist(scpX, scpY, targetX - 70, targetY);
        if (d < 10) {
            // 逐渐吸收光源
            if (bulbTarget > 0) bulbTarget -= 0.02;
            if (uvTarget > 0) uvTarget -= 0.02;
            if (xrayTarget > 0) xrayTarget -= 0.02;

            if (bulbTarget <= 0 && uvTarget <= 0 && xrayTarget <= 0) {
                movingToLight = false;
                absorbedLight = true;
                if (scpY < 200) {
                    unstableForm = true; // 进入形态不稳定状态
                } else if (targetY == 250) { // 只在 UV 灯吸收时触发摩斯电码

                    morseMode = true; // 进入摩斯电码模式
                    morseIndex = (morseIndex + 1) % morseLibrary.length; // 选择下一个摩斯电码
                    morseCodePoints = []; // 清空当前摩斯点，准备新一轮
                } else if (targetY == 400) {
                    // 触发 SCP-XXXX 贴脸形态
                    jumpScareTriggered = true;
                    scareTimer = millis();
                    return;

                }
                absorptionCompleteTime = millis();
            }
        }
    } else if (absorbedLight) {
        // 进入黑暗前，形态持续不稳定
        if (millis() - absorptionCompleteTime > waitBeforeBlackout) {
            fadeToBlack = true; // 触发黑暗
            absorbedLight = false;
            blackoutStartTime = millis();
        }
    } else if (fadeToBlack) {
        if (millis() - blackoutStartTime > blackoutDuration) {
            fadeToBlack = false;
            unstableForm = false; // 恢复正常形态
        }
    } else {

        // 正常状态下自由移动
        let newX = noise(time) * width * 0.6 + width * 0.2;
        let newY = noise(time + 100) * height * 0.6 + height * 0.2;
        scpX = newX;
        scpY = newY;
        if (scpX + 50 > 690) scpX = 690 - 50;
        time += 0.01;
    }
}


// 画普通灯泡
function drawBulb(x, y, lightColor) {
    fill(lightColor);
    stroke(200);
    ellipse(x, y, 40, 30);
    fill(150);
    rect(x + 20, y - 5, 20, 10);
}

// 画紫外线灯
function drawUVLamp(x, y, lightColor) {
    fill(150);
    rect(x - 10, y - 20, 40, 20);
    fill(lightColor);
    ellipse(x + 10, y - 10, 10, 40);
}

// 画 X 射线灯
function drawXRayLamp(x, y, lightColor) {
    fill(150);
    rect(x - 15, y - 25, 50, 30);
    fill(lightColor);
    ellipse(x - 10, y - 10, 20, 50);
}

// 画光扩散（不会超过 x=690）
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


// **灯光切换**
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
        buttonsVisible = false; // **隐藏按钮**
    }
}
// 让 SCP-XXXX 移动到光源
function moveSCPToLight(x, y) {
    targetX = x;
    targetY = y;
    movingToLight = true;
}
function generateMorseCode() {
    morseCodePoints = []; // 清空上一轮的摩斯电码

    for (let i = 0; i < 5; i++) { // 每次生成 5 个摩斯电码
        let entry = random(morseLibrary); // 随机选取一个摩斯电码
        let x = random(100, 690 - 100); // 随机 x 位置
        let y = random(100, height - 100); // 随机 y 位置
        morseCodePoints.push({ text: entry.code, x, y, alpha: 255, startTime: millis() });
    }
}


function drawMorseCode() {
    let now = millis();

    for (let i = morseCodePoints.length - 1; i >= 0; i--) {
        let p = morseCodePoints[i];
        let elapsed = now - p.startTime;

        if (elapsed > morseLifetime) {
            morseCodePoints.splice(i, 1); // 超时移除
            continue;
        }

        let fadeAmount = map(elapsed, 0, morseLifetime, 255, 0); // 逐渐淡出
        fill(255, 0, 0, fadeAmount);
        textSize(24);
        textAlign(CENTER, CENTER);
        text(p.text, p.x, p.y);
    }
}
// **绘制摩斯电码对照表**
function drawMorseDictionary() {
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

    // SCP-XXXX 贴脸形态
    noFill();
    stroke(255, alpha);
    strokeWeight(5);

    // 画出扭曲的五角星形
    beginShape();
    for (let i = 0; i < 5; i++) {
        let angle = PI * 0.4 * i + random(-0.2, 0.2); // 加随机偏移
        let x = cos(angle) * (width * 0.6 + random(-20, 20));
        let y = sin(angle) * (width * 0.6 + random(-20, 20));
        vertex(x, y);
    }
    endShape(CLOSE);

    // 画眼睛
    fill(255, alpha);
    noStroke();
    ellipse(-50, -50, 100, 100);
    ellipse(50, -50, 100, 100);

    // 画出裂开的嘴巴，带有尖牙
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
    // 重新初始化所有变量
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




