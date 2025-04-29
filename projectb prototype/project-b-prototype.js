// JavaScript source code
class GameSession {
    constructor() {
        this.numPlayers = "";
        this.playerSelections = []; // To store which story each player selects
        this.currentPlayer = 0;
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