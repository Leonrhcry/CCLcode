let options = [];
let selectedOption = null; // To store the selected option

// List of events and images for 2020 to 2025
let events = [
    { type: 'text', content: 'COVID-19 Pandemic' },
    { type: 'text', content: 'Trump Election' },
    { type: 'text', content: '2021 Tokyo Olympics' },
    { type: 'text', content: 'Russia-Ukraine War' },
    { type: 'image', content: 'assets/trumpshot.jpg' },
    { type: 'image', content: 'assets/chatgpt.jpg' },
];

// Create an array to store loaded images
let images = {};

function preload() {
    for (let event of events) {
        if (event.type === 'image') {
            images[event.content] = loadImage(event.content);
        }
    }
}

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");

    // Retrieve the number of players from localStorage
    let numPlayers = parseInt(localStorage.getItem("numPlayers")) || 0;

    // Create a new instance of GameSession and set number of players
    gameSession.setNumPlayers(numPlayers);

    // Display the number of players on the canvas
    textSize(30);
    text("Number of players: " + gameSession.getNumPlayers(), width / 2 - 120, height / 2);

    // Randomly choose four options (images and text)
    options = selectOptions(events);
}

function draw() {
    background(220);

    textSize(20);
    for (let i = 0; i < options.length; i++) {
        let option = options[i];

        let xPosition, yPosition;

        if (i === 0) {
            // Top-left
            xPosition = width / 4 - 100;
            yPosition = height / 4 - 20;
        } else if (i === 1) {
            // Top-right
            xPosition = (3 * width) / 4 - 100;
            yPosition = height / 4 - 20;
        } else if (i === 2) {
            // Bottom-left
            xPosition = width / 4 - 100;
            yPosition = (3 * height) / 4 + 20;
        } else {
            // Bottom-right
            xPosition = (3 * width) / 4 - 100;
            yPosition = (3 * height) / 4 + 20;
        }

        if (option.type === 'text') {
            let textWidthMax = 200; // Maximum width before wrapping
            let words = option.content.split(' ');
            let newline = '';
            let y = yPosition;

            for (let i = 0; i < words.length; i++) {
                let tempLine = line + words[i] + ' ';
                if (textWidth(tempLine) <= textWidthMax) {
                    line = tempLine;
                } else {
                    text(newline, xPosition, y);
                    newline = words[i] + ' ';
                    y += 30; // Move to next line
                }
            }
            text(newline, xPosition, y); // Display the last line
        } else if (option.type === 'image') {
            let img = images[option.content];
            image(img, xPosition, yPosition, 100, 100);
        }
    }
}

function selectOptions(events) {
    let selectedOptions = [];
    let selectedIndexes = [];
    for (let i = 0; i < 4; i++) {
        let index;
        do {
            index = floor(random(events.length));
        } while (selectedIndexes.includes(index)); // Ensure no duplicate
        selectedIndexes.push(index);
        selectedOptions.push(events[index]);
    }
    return selectedOptions;
}

function mousePressed() {
    for (let i = 0; i < options.length; i++) {
        let option = options[i];

        let xPosition, yPosition;
        if (i === 0) {
            xPosition = width / 4 - 100;
            yPosition = height / 4 - 20;
        } else if (i === 1) {
            xPosition = (3 * width) / 4 - 100;
            yPosition = height / 4 - 20;
        } else if (i === 2) {
            xPosition = width / 4 - 100;
            yPosition = (3 * height) / 4 + 20;
        } else {
            xPosition = (3 * width) / 4 - 100;
            yPosition = (3 * height) / 4 + 20;
        }

        if (mouseX > xPosition && mouseX < xPosition + 200 && mouseY > yPosition - 20 && mouseY < yPosition + 200) {
            selectedOption = option.content;
            // Store player selection in GameSession
            gameSession.recordSelection(0, selectedOption); // Player 0 makes a selection (for simplicity, assuming only one player for now)
            console.log('Selected Option: ', selectedOption);
            break;
        }
    }
}

