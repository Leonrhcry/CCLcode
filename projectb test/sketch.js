class GameSession {
    constructor() {
        this.numPlayers = "";
        this.playerSelections = []; // To store which story each player selects
        this.currentPlayer = 0; // Keep track of which player is selecting
        this.options = []; // Store options for the current player
        this.selectedOption = null;
        this.currentState = 'initialScreen'; // initialScreen or selectionScreen
        this.events = [
            { type: 'text', content: 'COVID-19 Pandemic' },
            { type: 'text', content: 'Trump Election' },
            { type: 'text', content: '2021 Tokyo Olympics' },
            { type: 'text', content: 'Russia-Ukraine War' },
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
                index = floor(random(this.events.length));
            } while (selectedIndexes.includes(index));
            selectedIndexes.push(index);
            selectedOptions.push(this.events[index]);
        }
        return selectedOptions;
    }

    // Start the game by validating the number of players and transitioning
    startGame(numPlayers) {
        if (numPlayers > 0) {
            this.setNumPlayers(numPlayers);
            this.currentState = 'selectionScreen'; // Transition to selection screen
            console.log(this.numPlayers, this.currentState);
            // Store the game session data in localStorage
            const sessionData = {
                numPlayers: this.numPlayers,
                playerSelections: this.playerSelections,
                currentPlayer: this.currentPlayer
            };
            localStorage.setItem("gameSession", JSON.stringify(sessionData));
        }
    }

    // Draw the initial screen for entering the number of players
    displayInitialScreen() {
        background(220);
        textSize(50);
        text("Let's  write  about", 200, 100);
        text("2020       to      2025", 200, 150);
        textSize(30);
        text("Start", width / 2 - 50, height / 2);

        text("Num of players: " + this.numPlayers, 270, 300);
    }

    // Draw the selection screen where players choose options
    displaySelectionScreen() {
        textSize(30);
        text(`Player ${this.getCurrentPlayer() + 1} is selecting`, width / 2 - 150, 50);

        // If options have not been set yet, generate them
        if (this.options.length === 0) {
            this.options = this.selectOptions();
        }

        // Display the available options (either text or images)
        textSize(20);
        for (let i = 0; i < this.options.length; i++) {
            let option = this.options[i];
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
                let img = this.images[option.content];
                image(img, xPosition, yPosition, 100, 100);
            }
        }
    }

    // Update the game state, switch to the next player
    update() {
        // If player selection is done, move to the next player
        if (this.selectedOption) {
            this.recordSelection(this.getCurrentPlayer(), this.selectedOption);
            this.setCurrentPlayer(this.getCurrentPlayer() + 1);

            // If all players have selected, stop the game
            if (this.getCurrentPlayer() >= this.getNumPlayers()) {
                console.log('All players have selected their options:', this.getPlayerSelections());
                noLoop();
            } else {
                this.selectedOption = null;
                this.options = []; // Reset options to force new set for the next player
            }
        }
    }
    preloadImages() {
    for (let event of this.events) {
        if (event.type === 'image') {
            this.images[event.content] = loadImage(event.content);
        }
    }
}
}
let gameSession = new GameSession();

// Initialize the canvas and handle the game state
function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");

    gameSession.preloadImages();
    
}

// Game logic for drawing on canvas
function draw() {
    if (gameSession.currentState == 'initialScreen') {
        gameSession.displayInitialScreen();
    }else if (gameSession.currentState === 'selectionScreen') {
        gameSession.displaySelectionScreen();
    }
    gameSession.update(); // Handle player selection and state change
    if (350 < mouseX && mouseX < 460 && 200 < mouseY && mouseY < 250 && mouseIsPressed && numPlayersValid && gameSession.currentState=='initialScreen') {
        gameSession.startGame(int(gameSession.numPlayers));

    }
}
function mousePressed() {
    if (gameSession.currentState === 'initialScreen') {
        // Proceed if the number of players is valid
        
    } else if (gameSession.currentState === 'selectionScreen') {
        for (let i = 0; i < gameSession.options.length; i++) {
            let option = gameSession.options[i];
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
// Handle the player's keyboard input for number of players
function keyPressed() {
    if (key >= '0' && key <= '9') {
        gameSession.numPlayers += key;
    } else if (keyCode === BACKSPACE) {
        gameSession.numPlayers = gameSession.numPlayers.slice(0, -1); // Remove last character on backspace
    }

    // Ensure numPlayers is valid (greater than 0)
    if (int(gameSession.numPlayers) > 0) {
        numPlayersValid = true;
    } else {
        numPlayersValid = false;
    }
}
