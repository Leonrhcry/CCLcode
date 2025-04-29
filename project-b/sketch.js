class GameSession {
    constructor() {
        this.numPlayers = 0;
        this.playerSelections = []; // To store which story each player selects
    }

    // Set the number of players
    setNumPlayers(num) {
        this.numPlayers = num;
    }

    // Record a player's selection
    recordSelection(playerId, selection) {
        this.playerSelections[playerId] = selection;
    }

    // Get all player selections
    getPlayerSelections() {
        return this.playerSelections;
    }

    // Get number of players
    getNumPlayers() {
        return this.numPlayers;
    }
}

let gameSession = new GameSession(); // Create a new GameSession instance
let numPlayers = ""; // Store the input as a string initially
let numPlayersValid = false; // Flag to check if the number of players is valid

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");

    textSize(30);
}

function draw() {
    background(220);
    textSize(50);
    text("Let's  write  about", 200, 100);
    text("2020       to      2025", 200, 150);
    textSize(30);
    text("Start", width / 2 - 50, height / 2);

    // Display the number of players dynamically as the player types
    text("Num of players: " + numPlayers, 270, 300);

    // Validate the number and set valid flag if greater than zero
    if (numPlayersValid && int(numPlayers) > 0) {
        numPlayersValid = true;
    } else if (numPlayersValid) {
        numPlayersValid = false; // Invalidate if the number is zero or negative
    }

    // Only allow transitioning if the number is valid
    if (350 < mouseX && mouseX < 460 && 200 < mouseY && mouseY < 250 && mouseIsPressed && numPlayersValid) {
        startGame();
    }
}

function keyPressed() {
    // Append the pressed number to the numPlayers string
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

function startGame() {
    // If the number is valid and greater than zero
    if (numPlayersValid && int(numPlayers) > 0) {
        console.log('Number of players: ', numPlayers);

        // Store the number of players in GameSession
        gameSession.setNumPlayers(numPlayers);

        // Store the number of players in localStorage
        localStorage.setItem("numPlayers", numPlayers);

        // Redirect to the game screen (select.html)
        window.location.href = "select.html";
    } else {
        console.log("Invalid number of players. Please enter a valid number greater than 0.");
    }
}
