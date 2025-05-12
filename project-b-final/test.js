// JavaScript source code
class GameSession {
    constructor() {
        this.numPlayers = "";
        this.playerSelections = []; // To store which story each player selects
        this.currentPlayer = 0; // Keep track of which player is selecting
        this.options = []; // Store options for the current player
        this.writingData = {};
        this.selectedVotes = [];
        this.voted = [];
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

    preloadImages() {
        for (let event of this.events) {
            if (event.type === 'image') {
                this.images[event.content] = loadImage(event.content);
            }
        }
    }
    updateWriting() {
        if (this.writingData[this.currentPlayer] !== undefined && this.writingData[this.currentPlayer] != undefined) {
            this.writingData[this.getCurrentPlayer()] = this.writingData[this.getCurrentPlayer()] || "";
            this.setCurrentPlayer(this.getCurrentPlayer() + 1);
            // If all players have finished writing, show full story or end game
            if ((this.getCurrentPlayer()>= this.getNumPlayers())) {
            //    currentState = 'votingScreen';
                //    this.setCurrentPlayer(0);
                
                console.log('All players have written their part:', this.writingData);
                noLoop();
            }    
        }
    }
    recordVote(criterionIndex, vote) {
        const order = ['Interest', 'Innovation', 'Logic', 'Seriousness'];

        let criterionPosition = order.indexOf(order[criterionIndex]);
        let xPosition = width / 2 - 100 + (vote - 1) * 50;
        let yPosition = 150 + criterionIndex * 60; // Vertical offset for the criterion
        if (!this.selectedVotes[this.getCurrentPlayer()]) {
            this.selectedVotes[this.getCurrentPlayer()] = [];
        }
        // Store the rectangle's coordinates in the voted array
        this.voted.push({ x: xPosition, y: yPosition - 15, width: 30, height: 30 });
        this.selectedVotes[this.currentPlayer][criterionPosition] = vote;
        //// Add the vote to the selectedVotes array for this player
        //this.selectedVotes[this.currentPlayer] = this.selectedVotes[this.currentPlayer] || [];
        //this.selectedVotes[this.currentPlayer][criterionIndex] = vote;

    }
    resetVotes() {
        this.voted = []; // Clear the rectangles for the next player
    }
    canVoteForRow(rowIndex) {
        // Check if the player has already voted for this row
        if (this.selectedVotes[this.currentPlayer]) {
            return !this.selectedVotes[this.currentPlayer][rowIndex];
        }
        return true;
    }
    // Calculate the average vote for each criterion
    calculateAverageVotes() {
        const order = ['Interest', 'Innovation', 'Logic', 'Seriousness'];
        let averages = [0, 0, 0, 0];
        let totalVotes = this.numPlayers;

        for (let i = 0; i < totalVotes; i++) {
            let playerVotes = this.selectedVotes[i];
            for (let j = 0; j < 4; j++) {
                if (playerVotes[j] !== null) {
                    averages[j] += playerVotes[j];
                }
            }
        }

        // Calculate the average for each criterion
        for (let j = 0; j < 4; j++) {
            averages[j] = averages[j] / totalVotes;
        }

        return averages;
    }
}

let gameSession = new GameSession();
let selectedOption = null;
let numPlayersValid = false;
let options = [];
let currentState = 'initialScreen';
let hoveredOption = -1;
let goToVotingButton = false;
let finishButton = true;
let canWrite = true;
function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");

    gameSession.preloadImages();
    cursor(CROSS);

    textSize(30);
}

function draw() {
    background(220);
    if (currentState == 'initialScreen') {
        displayInitialScreen();
    } else if (currentState == 'selectionScreen') {
        displaySelectionScreen();
    } else if (currentState == 'writingScreen') {
        if (gameSession.getCurrentPlayer() < gameSession.playerSelections.length) {
            displayWritingScreen();
        }
    }else if(currentState=='votingScreen'){
        displayVotingScreen();
    } else if (currentState === 'resultScreen') {
        displayResultScreen();
    }
}

function displayInitialScreen() {
    textSize(50);
    text("Let's  write  about", 200, 100);
    
    text("2020       to      2025", 200, 150);
    textSize(20);

    text("Input num of players: " + gameSession.numPlayers, 270, 300);
    let startButton = false;
    // Proceed if the number of players is valid
    if (numPlayersValid && int(gameSession.numPlayers) > 0 && int(gameSession.numPlayers) <= 10) {
        numPlayersValid = true;
        startButton = true
        text("Start", width / 2 - 50, height / 2);
    } else if (numPlayersValid) {
        numPlayersValid = false; // Invalidate if the number is zero or negative
    }

    // When the start button is clicked and numPlayers is valid
    if (350 < mouseX && mouseX < 460 && 200 < mouseY && mouseY < 250 && mouseIsPressed && numPlayersValid && startButton==true) {
        gameSession.setNumPlayers(int(gameSession.numPlayers));   
        currentState = 'selectionScreen'; // Transition to selection screen
    }
}

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
        let boxColor = (i === hoveredOption) ? color(200, 255, 200) : color(255, 255, 255);

        let rectWidth = 200; // Width of the rectangle
        let rectHeight = 83; // Height of the rectangle
        fill(255, 255, 255);
        stroke(0);
        fill(boxColor);
        rect(xPosition - 10, yPosition - 10, rectWidth + 20, rectHeight + 20);
        noFill();
        if (option.type === 'text') {
            let textWidthMax = rectWidth;//200
            let words = option.content.split(' ');
            let newline = '';
            let y = yPosition;

            for (let i = 0; i < words.length; i++) {
                let tempLine = newline + words[i] + ' ';
                if (textWidth(tempLine) <= textWidthMax) {
                    newline = tempLine;
                } else {
                    text(newline, xPosition, y+20);
                    newline = words[i] + ' ';
                    y += 20;
                }
            }
            text(newline, xPosition, y+20);
        } else if (option.type === 'image') {
            let img = gameSession.images[option.content];
            if (img) {
                //image(img, xPosition, yPosition, 100, 100);
                image(img, xPosition + 10, yPosition-5, 80, 80);
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
    text("Start writing based on your clue and others' work", 150, 100);

    let selectedOption = gameSession.playerSelections[gameSession.getCurrentPlayer()];
    textSize(16);
    text("Your selected option:", width - 200, 50);
    if (typeof selectedOption === 'string' && selectedOption.includes('.jpg')) {
        let img = gameSession.images[selectedOption];
        if (img) {
            image(img, width - 150, 70, 100, 100);
        }
    } else {
        text(selectedOption, width - 200, 70);
    }

    // Display the text typed by all players up until the current one
    let yPosition = 130; // Starting Y position for the story
    let maxLineLength = width - 150;
    let xPosition = 70;  // Left-most position for the text
    
    let lines = [];
    let currentLine = '';

    // Add previous lines of text to the 'lines' array and display them
    for (let i = 0; i <= gameSession.getCurrentPlayer(); i++) {
        
        let playerStory = gameSession.writingData[i] || "";

        // Word wrap the story text
        let words = playerStory.split(' ');
        let line = '';

        // Handle word wrapping
        for (let j = 0; j < words.length; j++) {
            let testLine = line + words[j] + ' ';
            let testWidth = textWidth(testLine);

            // If the line is too long, move it to the lines array and start a new one
            if (testWidth > maxLineLength-170) {
                lines.push(line);  // Add the full line to the lines array
                line = words[j] + ' ';  // Start a new line with the current word
            } else {
                line = testLine;  // Add word to the line
            }
        }

        // Add any remaining text as the last line
        lines.push(line);
    }
    // Display all lines from the array (lines array contains the story until the current player)
    for (let i = 0; i < lines.length; i++) {
        textSize(18);
        text(lines[i], xPosition, yPosition);
        yPosition += 30;  // Move down for the next line
    }

    // Display the current player's story (the current line being typed)
    textSize(18);
    text('Player' + (gameSession.getCurrentPlayer() + 1) + ':', xPosition - 70, yPosition-30);
    text(currentLine, xPosition, yPosition);  // Show the current player's text
    yPosition += 30;  // Move down for the next line
    if (finishButton) {
        rect(width - 60, height - 50, 60, 50);
        text("Finish", width - 60, height - 30);
    }
    

    // Show the "Go to Voting" button after the last player finishes
    if (goToVotingButton) {
        rect(width / 2 - 60, height - 50, 120, 50);
        text("Go to Voting", width / 2 - 50, height - 10);
    }
}
function displayVotingScreen() {
    background(220);

    textSize(30);
    text("Vote on the scale of the story!", width / 2 - 170, 50);
    text("Player" + (gameSession.getCurrentPlayer()+1) + "is voting......", width / 2 - 130, 80);

    let criteria = ['Interest', 'Innovation', 'Logic', 'Seriousness'];
    let yPosition = 120; // Y position to display the criteria and votes

    // Display each criterion with clickable numbers from 1 to 5
    for (let i = 0; i < criteria.length; i++) {
        textSize(20);
        text(criteria[i], width / 2 - 100, yPosition);
        yPosition += 30;

        for (let j = 0; j < 5; j++) {
            let xPosition = width / 2 - 100 + j * 50;

            fill(255);
            rect(xPosition, yPosition - 15, 30, 30);
            fill(0);
            text(j + 1, xPosition + 10, yPosition + 5);
        }
        for (let k = 0; k < gameSession.voted.length; k++) {
            let vote = gameSession.voted[k];

            // Draw the rectangle with a green color for the selected vote
            fill(200, 255, 200); // Green color for selected vote
            rect(vote.x, vote.y, vote.width, vote.height); // Draw the rectangle
        }
        noFill();
        yPosition += 30; // Move to the next criterion
    }
    
}

function displayResultScreen() {
    background(220);

    textSize(30);
    text("Average Votes for Each Criterion", width / 2 - 180, 50);

    let averages = gameSession.calculateAverageVotes(); // Get the average votes for each criterion

    let criteria = ['Interest', 'Innovation', 'Logic', 'Seriousness'];
    let yPosition = 150;

    // Display the averages for each criterion
    for (let i = 0; i < criteria.length; i++) {
        textSize(20);
        text(`${criteria[i]}: ${averages[i].toFixed(2)}`, width / 2 - 100, yPosition);
        yPosition += 30;
    }

    // Optionally, add more UI for the result screen, such as the "Go to Next Round" button
}

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
    if (canWrite) {
        if (currentState === 'writingScreen' && keyCode !== BACKSPACE && keyCode !== ENTER && keyCode !== SHIFT) {
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
}

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

            if (mouseX > xPosition && mouseX < xPosition + 200 && mouseY > yPosition - 20 && mouseY < yPosition + 90) {
                selectedOption = option.content;
                console.log('Player ' + (gameSession.getCurrentPlayer() + 1) + ' selected: ', selectedOption);
                break;
            }
        }
    }
    if (currentState == 'writingScreen') {
        if (width - 60 < mouseX && mouseX<width && height - 50 < mouseY && mouseY < height && finishButton) {
            console.log('player ' + (gameSession.getCurrentPlayer() + 1) + ' finished');
            if (gameSession.getCurrentPlayer() + 1 >= gameSession.getNumPlayers()) {
                console.log(gameSession.getCurrentPlayer(), gameSession.getNumPlayers())
                goToVotingButton = true;
                finishButton = false;
                canWrite = false;
            } else {
                gameSession.updateWriting();
            }
            
        }
        if (goToVotingButton && width / 2 - 60 < mouseX && mouseX < width / 2 + 60 && height - 50 < mouseY && mouseY < height) {
            gameSession.setCurrentPlayer(0);
            currentState = 'votingScreen';  // Transition to the voting screen
            console.log('All players have finished watching the story');
        }
    }
    if (currentState === 'votingScreen') {
        let criteria = ['Interest', 'Innovation', 'Logic', 'Seriousness'];
        

        for (let i = 0; i < criteria.length; i++) {
            let yPosition = 150 + i * 60;

            if (gameSession.selectedVotes[gameSession.getCurrentPlayer()] && gameSession.selectedVotes[gameSession.getCurrentPlayer()][i]) {
                continue;
            }
            for (let j = 0; j < 5; j++) {
                let xPosition = width / 2 - 100 + j * 50;
                if (mouseX > xPosition && mouseX < xPosition + 30 && mouseY > yPosition-15 && mouseY < yPosition + 15) {
                    let vote = j + 1; // Vote is the number clicked (1 to 5)
                    console.log('player'+gameSession.getCurrentPlayer()+'vote'+vote);

                    // Record the vote for the current player and criterion
                    gameSession.recordVote(i, vote);
                    if (gameSession.selectedVotes[gameSession.getCurrentPlayer()][0] && gameSession.selectedVotes[gameSession.getCurrentPlayer()][1] && gameSession.selectedVotes[gameSession.getCurrentPlayer()][2] && gameSession.selectedVotes[gameSession.getCurrentPlayer()][3]) {
                        if (gameSession.getCurrentPlayer() + 1 < gameSession.numPlayers) {
                            gameSession.setCurrentPlayer(gameSession.getCurrentPlayer() + 1);
                            gameSession.resetVotes(); // Reset votes for the next player
                        } else {
                            console.log('All players have voted.');
                            console.log(gameSession.selectedVotes);
                            currentState = 'resultScreen';
                        }
                    }
                }
            }
        }
    }
}

function mouseMoved() {
    hoveredOption = -1;

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

        let boxWidth = 200;
        let boxHeight = 80;

        if (mouseX > xPosition && mouseX < xPosition + boxWidth && mouseY > yPosition - 20 && mouseY < yPosition + boxHeight) {
            hoveredOption = i;
        }
    }
}