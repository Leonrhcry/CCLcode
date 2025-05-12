// JavaScript source code
// GameSession class
class GameSession {
    constructor() {
        this.numPlayers = 0;
        this.playerSelections = []; // To store which story each player selects
        this.currentPlayer = 0; // Keep track of which player is selecting
    }

    setNumPlayers(num) {
        this.numPlayers = num;
    }

    recordSelection(playerId, selection) {
        this.playerSelections[playerId] = selection;
    }

    getPlayerSelections() {
        return this.playerSelections;
    }

    getNumPlayers() {
        return this.numPlayers;
    }

    setCurrentPlayer(playerId) {
        this.currentPlayer = playerId;
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }
}

let options = [];
let selectedOption = null;
let numPlayers = "";
let numPlayersValid = false;
let gameSession = new GameSession(); // Create a new GameSession instance

let events = [
    { type: 'text', content: 'COVID-19 Pandemic' },
    { type: 'text', content: 'Trump Election' },
    { type: 'text', content: '2021 Tokyo Olympics' },
    { type: 'text', content: 'Russia-Ukraine War' },
    { type: 'image', content: 'assets/trumpshot.jpg' },
    { type: 'image', content: 'assets/chatgpt.jpg' },
];

let images = {}; // Store images in an object

// Game state (which screen to display)
let currentState = 'initialScreen'; // initialScreen or selectionScreen

// Initialize the game
function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");

    // Retrieve game session data from localStorage
    let storedGameSession = localStorage.getItem("gameSession");

    if (storedGameSession) {
        let sessionData = JSON.parse(storedGameSession);
        // Rebuild the GameSession instance from the stored data
        gameSession = new GameSession();
        gameSession.setNumPlayers(sessionData.numPlayers);
        gameSession.playerSelections = sessionData.playerSelections;
        gameSession.setCurrentPlayer(sessionData.currentPlayer);
    }

    // Preload images
    preloadImages();

    textSize(30);
}

// Preload images used in the game
function preloadImages() {
    for (let event of events) {
        if (event.type === 'image') {
            images[event.content] = loadImage(event.content);
        }
    }
}

// Game logic for drawing on canvas
function draw() {
    background(220);

    if (currentState === 'initialScreen') {
        // Initial screen for entering number of players
        textSize(50);
        text("Let's  write  about", 200, 100);
        text("2020       to      2025", 200, 150);
        textSize(30);
        text("Start", width / 2 - 50, height / 2);

        text("Num of players: " + numPlayers, 270, 300);

        if (numPlayersValid && int(numPlayers) > 0) {
            numPlayersValid = true;
        } else if (numPlayersValid) {
            numPlayersValid = false; // Invalidate if the number is zero or negative
        }

        // Proceed if the number of players is valid
        if (350 < mouseX && mouseX < 460 && 200 < mouseY && mouseY < 250 && mouseIsPressed && numPlayersValid) {
            startGame();
        }
    } else if (currentState === 'selectionScreen') {
        // Player selection screen
        textSize(30);
        text(`Player ${gameSession.getCurrentPlayer() + 1} is selecting`, width / 2 - 150, 50);

        // If options have not been set yet, generate them
        if (options.length === 0) {
            options = selectOptions(events);
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
                let img = images[option.content];
                image(img, xPosition, yPosition, 100, 100);
            }
        }

        // If player selection is done, move to next player
        if (selectedOption) {
            gameSession.recordSelection(gameSession.getCurrentPlayer(), selectedOption);
            gameSession.setCurrentPlayer(gameSession.getCurrentPlayer() + 1);
            if (gameSession.getCurrentPlayer() >= gameSession.getNumPlayers()) {
                console.log('All players have selected their options:', gameSession.getPlayerSelections());
                noLoop();
            } else {
                selectedOption = null;
                options = []; // Reset options to force new set for the next player
            }
        }
    }
}

// Select random options for the game
function selectOptions(events) {
    let selectedOptions = [];
    let selectedIndexes = [];
    for (let i = 0; i < 4; i++) {
        let index;
        do {
            index = floor(random(events.length));
        } while (selectedIndexes.includes(index));
        selectedIndexes.push(index);
        selectedOptions.push(events[index]);
    }
    return selectedOptions;
}

// Handle mouse presses to select an option
function mousePressed() {
    if (currentState === 'initialScreen') {
        // Do nothing for mouse press on the initial screen for now.
    } else if (currentState === 'selectionScreen') {
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

// Handle player turn start
function startGame() {
    if (numPlayersValid && int(numPlayers) > 0) {
        gameSession.setNumPlayers(numPlayers);

        // Store the game session data in localStorage
        const sessionData = {
            numPlayers: gameSession.getNumPlayers(),
            playerSelections: gameSession.getPlayerSelections(),
            currentPlayer: gameSession.getCurrentPlayer()
        };
        localStorage.setItem("gameSession", JSON.stringify(sessionData));

        // Transition to the selection screen
        currentState = 'selectionScreen';
    } else {
        console.log("Invalid number of players. Please enter a valid number greater than 0.");
    }
}

// Handle the player's keyboard input for number of players
function keyPressed() {
    if (key >= '0' && key <= '9') {
        numPlayers += key;
    } else if (keyCode === BACKSPACE) {
        numPlayers = numPlayers.slice(0, -1); // Remove last character on backspace
    }

    // Ensure numPlayers is valid (greater than 0)
    if (int(numPlayers) > 0) {
        numPlayersValid = true;
    } else {
        numPlayersValid = false;
    }
}
