// JavaScript source code
class GameSession {
    constructor() {
        this.numPlayers = "";
        this.playerSelections = []; // To store which story each player selects
        this.currentPlayer = 0; // Keep track of which player is selecting
        this.options = []; // Store options for the current player
        this.writingData = {};
        this.events = [
            { type: 'text', content: 'COVID-19 Pandemic' },
            { type: 'text', content: 'Trump Election' },
            { type: 'text', content: '2021 Tokyo Olympics' },
            { type: 'text', content: 'Russia-Ukraine War' },
            { type: 'text', content: 'American Astronaut stranded' },
            { type: 'text', content: 'UN Climate Change Conference' },
            { type: 'text', content: 'iphone16'},
            { type: 'image', content: 'assets/trumpshot.jpg' },
            { type: 'image', content: 'assets/chatgpt.jpg' },
        ];
        this.images = {}; // Store images in an object
    }

    // Set number of players
    setNumPlayers(num) {
        this.numPlayers = num;
    }

    // Record a player's selection
    recordSelection(playerId, selection) {
        this.playerSelections[playerId] = selection;
    }

    // Get the player selections
    getPlayerSelections() {
        return this.playerSelections;
    }

    // Get number of players
    getNumPlayers() {
        return this.numPlayers;
    }

    // Set the current player
    setCurrentPlayer(playerId) {
        this.currentPlayer = playerId;
    }

    // Get the current player
    getCurrentPlayer() {
        return this.currentPlayer;
    }

    // Select random options for the game
    selectOptions() {
        let selectedOptions = [];
        let selectedIndexes = [];
        for (let i = 0; i < 4; i++) {
            let index;
            do {
                index = floor(random(this.events.length)); // Randomly pick an event
            } while (selectedIndexes.includes(index)); // Ensure no duplicate
            selectedIndexes.push(index);
            selectedOptions.push(this.events[index]);
        }
        return selectedOptions;
    }

    // Preload images used in the game
    preloadImages() {
        for (let event of this.events) {
            if (event.type === 'image') {
                this.images[event.content] = loadImage(event.content);
            }
        }
    }
    // Update the game state, switch to the next player after writing
    updateWriting() {
        if (keyIsPressed && keyCode === ENTER) {
            // Move to next player after they finish writing their part
            this.writingData[this.getCurrentPlayer()] = this.writingData[this.getCurrentPlayer()] || "";
            this.setCurrentPlayer(this.getCurrentPlayer() + 1);
            console.log(this.writingData[this.currentPlayer]);
            // If all players have finished writing, show full story or end game
            if (this.getCurrentPlayer() >= this.getNumPlayers()) {
                console.log('All players have written their part:', this.writingData);
                noLoop(); // End the game or transition to the next phase
            }
        }
    }
}

// Global game session object
let gameSession = new GameSession();
let selectedOption = null;
let numPlayersValid = false;
let options = [];

// Game state (which screen to display)
let currentState = 'initialScreen'; // initialScreen or selectionScreen

// Initialize the canvas and handle the game state
function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");

    gameSession.preloadImages(); // Preload images for the game

    textSize(30);
}

// Game logic for drawing on canvas
function draw() {
    background(220);

    if (currentState === 'initialScreen') {
        // Initial screen for entering number of players
        displayInitialScreen();
    } else if (currentState === 'selectionScreen') {
        // Player selection screen
        displaySelectionScreen();
    } else if (currentState === 'writingScreen') {
        displayWritingScreen();
        gameSession.updateWriting(); // Update the writing phase
    }
}

// Draw the initial screen for entering the number of players
function displayInitialScreen() {
    textSize(50);
    text("Let's  write  about", 200, 100);
    text("2020       to      2025", 200, 150);
    textSize(30);
    text("Start", width / 2 - 50, height / 2);

    text("Num of players: " + gameSession.numPlayers, 270, 300);

    // Proceed if the number of players is valid
    if (numPlayersValid && int(gameSession.numPlayers) > 0) {
        numPlayersValid = true;
    } else if (numPlayersValid) {
        numPlayersValid = false; // Invalidate if the number is zero or negative
    }

    // When the start button is clicked and numPlayers is valid
    if (350 < mouseX && mouseX < 460 && 200 < mouseY && mouseY < 250 && mouseIsPressed && numPlayersValid) {
        gameSession.setNumPlayers(int(gameSession.numPlayers));
        currentState = 'selectionScreen'; // Transition to selection screen
    }
}

// Draw the selection screen where players choose options
function displaySelectionScreen() {
    textSize(30);
    text(`Player ${gameSession.getCurrentPlayer() + 1} is selecting`, width / 2 - 150, 50);

    // If options have not been set yet, generate them
    if (options.length === 0) {
        options = gameSession.selectOptions();
    }

    // Display the available options (either text or images)
    textSize(20);
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

        if (option.type === 'text') {
            let textWidthMax = 200;
            let words = option.content.split(' ');
            let newline = '';
            let y = yPosition;

            for (let i = 0; i < words.length; i++) {
                let tempLine = newline + words[i] + ' ';
                if (textWidth(tempLine) <= textWidthMax) {
                    newline = tempLine;
                } else {
                    text(newline, xPosition, y);
                    newline = words[i] + ' ';
                    y += 30;
                }
            }
            text(newline, xPosition, y);
        } else if (option.type === 'image') {
            let img = gameSession.images[option.content];
            if (img) {
                image(img, xPosition, yPosition, 100, 100);
            }
        }
        if (selectedOption && currentState == 'selectionScreen') {

            gameSession.recordSelection(gameSession.getCurrentPlayer(), selectedOption);
            gameSession.setCurrentPlayer(gameSession.getCurrentPlayer() + 1);
            if (gameSession.getCurrentPlayer() >= gameSession.getNumPlayers()) {
                gameSession.setCurrentPlayer(0);
                console.log('current player:', gameSession.getCurrentPlayer());
                console.log('All players have selected their options:', gameSession.getPlayerSelections());
                currentState = 'writingScreen'; // Transition to writing phase
            } else {
                selectedOption = null;
                options = []; // Reset options to force new set for the next player
            }
        }
    }
}
function displayWritingScreen() {
    background(220);
    textSize(30);
    text(`Player ${gameSession.getCurrentPlayer() + 1} is writing...`, width / 2 - 150, 50);

    textSize(20);
    text("Start writing your story here:", width / 2 - 150, height / 2 - 100);

    textSize(18);
    text(gameSession.writingData[gameSession.getCurrentPlayer()] || "", width / 2 - 150, height / 2); // Display what player typed so far

    textSize(20);
    text("Press Enter to finish your turn", width / 2 - 150, height / 2 + 100);
}

// Handle player input for number of players
function keyPressed() {
    if (currentState == 'initialScreen') {
        if (key >= '0' && key <= '9') {
            gameSession.numPlayers += key;
        } else if (keyCode === BACKSPACE) {
            gameSession.numPlayers = gameSession.numPlayers.slice(0, -1); // Remove last character on backspace
        }
    }
    // Ensure numPlayers is valid (greater than 0)
    if (int(gameSession.numPlayers) > 0) {
        numPlayersValid = true;
    } else {
        numPlayersValid = false;
    }
    // Allow the player to type their story in the writing phase
    if (currentState === 'writingScreen' && keyCode !== BACKSPACE && keyCode !== ENTER) {
        // Ensure there is a valid story and add the current key
        gameSession.writingData[gameSession.getCurrentPlayer()] = gameSession.writingData[gameSession.getCurrentPlayer()] || "";
        gameSession.writingData[gameSession.getCurrentPlayer()] += key;
    } else if (keyCode === BACKSPACE) {
        // If backspace is pressed, remove the last character of the current player's story
        if (gameSession.writingData[gameSession.getCurrentPlayer()] && gameSession.writingData[gameSession.getCurrentPlayer()].length > 0) {
            gameSession.writingData[gameSession.getCurrentPlayer()] = gameSession.writingData[gameSession.getCurrentPlayer()].slice(0, -1);
        }
    }
}

// Handle mousePressed events for player selection
function mousePressed() {
    if (currentState === 'selectionScreen') {
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
                console.log('Player ' + (gameSession.getCurrentPlayer() + 1) + ' selected: ', selectedOption);
                break;
            }
        }
    }
}
