const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
const rollDiceButton = document.getElementById('rollDice');
const playerInfoDiv = document.getElementById('playerInfo');
const overlay = document.getElementById('overlay');
const promptText = document.getElementById('promptText');
const buyYesButton = document.getElementById('buyYes');
const buyNoButton = document.getElementById('buyNo');
const diceOverlay = document.getElementById('diceOverlay');
const diceDisplay = document.getElementById('diceDisplay');

// const BOARD_SIZE = 600;
// const BOARD_SIZE =600;
const BOARD_SIZE = 1100; // Increase canvas size
const SQUARE_SIZE = BOARD_SIZE / 11.3;


const cornerSize = 79.1150442477876 * (BOARD_SIZE/600);
const regularSize = 50.00734513274336 * (BOARD_SIZE/600);

const boardImage = new Image();
// boardImage.src = 'efefe'
boardImage.src = 'https://m.media-amazon.com/images/I/81oC5pYhh2L._AC_UF894,1000_QL80_.jpg';
boardImage.src = '/transparent.png';
let useImageBoard = false;

const properties = [
{ name: 'GO', price: 0, owner: '' },
{ name: 'Canterbury Cathedral', price: 60, owner: '' },
{ name: 'Bounty Chest', price: 0, owner: '' },
{ name: 'Notre-Dame', price: 60, owner: '' },
{ name: 'Carucage Tax', price: 100, owner: '' },
{ name: 'Roman Empire', price: 200, owner: '' },
{ name: 'The Alhambra', price: 100, owner: '' },
{ name: 'Chance', price: 0, owner: '' },
{ name: 'Mont Saint-Michel', price: 100, owner: '' },
{ name: 'Galata Tower', price: 120, owner: '' },
{ name: 'Just Visiting', price: 0, owner: '' },

{ name: 'Chartres Cathedral', price: 140, owner: '' },
{ name: 'Blacksmith', price: 150, owner: '' },
{ name: 'Windsor Castle', price: 140, owner: '' },
{ name: 'Edinburgh Castle', price: 160, owner: '' },
{ name: 'Byzantine Empire', price: 200, owner: '' },
{ name: 'Krak des Chevaliers', price: 180, owner: '' },
{ name: 'Bounty Chest', price: 0, owner: '' },
{ name: 'Burg Eltz', price: 180, owner: '' },
{ name: 'Hagia Sophia', price: 180, owner: '' },
{ name: 'Free Parking', price: 0, owner: '' },

{ name: 'Cluny Abbey', price: 220, owner: '' },
{ name: 'The University of Bologna', price: 220, owner: '' },
{ name: 'Chance', price: 0, owner: '' },
{ name: 'The Palace of the Popes', price: 240, owner: '' },
{ name: 'Ottoman Empire', price: 200, owner: '' },
{ name: 'Roskilde Cathedral', price: 260, owner: '' },
{ name: 'Prague Castle', price: 260, owner: '' },
{ name: 'Bakery', price: 150, owner: '' },
{ name: 'Saint Marks Basilica', price: 280, owner: '' },
{ name: 'Go to Jail', price: 0, owner: '' },

{ name: 'Alcazar of Segovia', price: 300, owner: '' },
{ name: 'Aachen Cathedral', price: 300, owner: '' },
{ name: 'Community Chest', price: 0, owner: '' },
{ name: 'Durham Cathedral', price: 320, owner: '' },
{ name: 'English Empire', price: 200, owner: '' },
{ name: 'Chance', price: 0, owner: '' },
{ name: 'Versailles', price: 350, owner: '' },
{ name: 'Carucage Tax', price: 100, owner: '' },
{ name: 'The Colosseum', price: 400, owner: '' }
];

const players = [
    { name: 'Player 1', position: 0, money: 1500, image: new Image(), prevPos: 'noJail' },
    { name: 'Player 2', position: 0, money: 1500, image: new Image(), prevPos: 'noJail' }
];

// Load player images
players[0].image.src = 'player1.png';
players[1].image.src = 'player2.png';

const bountyChests = [
    {title: 'You get $100!', earn: 100, pay: 0},
    {title: 'You pay $100', earn: 0, pay: 100}
]

const chanceCards = [
    {title: 'Free Parking + $100', advanceToPosition: 20, earn: 100, pay: 0},
    {title: 'Go to Go, and take away $100', advanceToPosition: 0, earn: 0, pay: 100}
]

let currentPlayerIndex = 0;

async function drawBoard() {
    ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);
    
    if (useImageBoard) {
        
        useImageBoard = true;
        console.log(boardImage.onload)
        // boardImage.onload = () => {
            // console.log('loaded')
            // }
            ctx.drawImage(boardImage, 0, 0, BOARD_SIZE, BOARD_SIZE);
    } else {
        drawTemplateBoard();
    }

    // Draw players
    players.forEach((player, index) => {
        const {x, y} = getPlayerCoordinates(player.position);
        // ctx.fillStyle = player.color;
        // ctx.beginPath();
        // ctx.arc(x, y, 10, 0, 2 * Math.PI);
        // ctx.fill();

        ctx.drawImage(player.image, x - 15, y - 15, 30 * (BOARD_SIZE/600), 30 * (BOARD_SIZE/600)); // Adjust size as needed

    });
}

function drawTemplateBoard() {
    ctx.strokeRect(0, 0, BOARD_SIZE, BOARD_SIZE);
    
    // Function to draw a single space
    function drawSpace(x, y, width, height, name) {
        ctx.strokeRect(x, y, width, height);
        ctx.font = '10px Arial';
        ctx.fillText(name, x + 5, y + 20, width - 10);
    }

    // Draw spaces
    for (let i = 0; i < 40; i++) {
        let x, y, width, height;

        if (i % 10 === 0) {  // Corner spaces
            switch(i) {
                case 0:  x = BOARD_SIZE - cornerSize; y = BOARD_SIZE - cornerSize; break;
                case 10: x = 0; y = BOARD_SIZE - cornerSize; break;
                case 20: x = 0; y = 0; break;
                case 30: x = BOARD_SIZE - cornerSize; y = 0; break;
            }
            width = height = cornerSize;
        } else if (i < 10) {  // Bottom row
            x = BOARD_SIZE - cornerSize - regularSize * (i);
            y = BOARD_SIZE - regularSize;
            width = regularSize;
            height = regularSize;
        } else if (i < 20) {  // Left column
            x = 0;
            y = BOARD_SIZE - cornerSize - regularSize * (i - 10);
            width = regularSize;
            height = regularSize;
        } else if (i < 30) {  // Top row (fixed)
            x = cornerSize + regularSize * (i - 20);
            y = 0;
            width = regularSize;
            height = regularSize;
        } else {  // Right column (fixed)
            x = BOARD_SIZE - regularSize;
            y = cornerSize + regularSize * (i - 30);
            width = regularSize;
            height = regularSize;
        }

        drawSpace(x, y, width, height, properties[i] ? properties[i].name : `Property ${i}`);
    }
}
function getPlayerCoordinates(position) {
    let x, y;

    if (position % 10 === 0) {  // Corner spaces
        switch(position) {
            case 0:  x = BOARD_SIZE - cornerSize / 2; y = BOARD_SIZE - cornerSize / 2; break;
            case 10: x = cornerSize / 2; y = BOARD_SIZE - cornerSize / 2; break;
            case 20: x = cornerSize / 2; y = cornerSize / 2; break;
            case 30: x = BOARD_SIZE - cornerSize / 2; y = cornerSize / 2; break;
        }
    } else if (position < 10) {  // Bottom row
        x = BOARD_SIZE - cornerSize - regularSize * (position - 0.5);
        y = BOARD_SIZE - regularSize / 2;
    } else if (position < 20) {  // Left column
        x = regularSize / 2;
        y = BOARD_SIZE - cornerSize - regularSize * (position - 10.5);
    } else if (position < 30) {  // Top row (fixed)
        x = cornerSize + regularSize * (position - 20.5);
        y = regularSize / 2;
    } else {  // Right column (fixed)
        x = BOARD_SIZE - regularSize / 2;
        y = cornerSize + regularSize * (position - 30.5);
    }

    return {x, y};
}


function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function movePlayer() {
    const player = players[currentPlayerIndex];
    if(player.prevPos != 'noJail')
    {
        player.position = player.prevPos
        player.prevPos = 'noJail'   

        endTurn()
        return
    }
    const roll1 = rollDice();
    const roll2 = rollDice();
    const totalRoll = roll1 + roll2;


    // Display dice roll
    diceDisplay.innerHTML = `${roll1} + ${roll2} = ${totalRoll}`;
    diceDisplay.innerHTML =  ' <img src="'+roll1+'.png" /> <img src="'+roll2+'.png" /> '
    diceOverlay.style.display = 'flex';
    
    setTimeout(() => {
        diceOverlay.style.display = 'none';
        movePlayerStep(player, totalRoll, 0);
    }, 2000);
}

function movePlayerStep(player, totalRoll, currentStep) {
    if (currentStep < totalRoll) {
        player.position = (player.position + 1) % 40;
        drawBoard();
        setTimeout(() => movePlayerStep(player, totalRoll, currentStep + 1), 300);
    } else {
        setTimeout(checkProperty, 1000);
    }
}

function checkProperty() {
    const player = players[currentPlayerIndex];
    const property = properties[player.position];

    if(player.position == 30)
    {
        sendToJail()
        endTurn()
        return   
    }

    if(player.position == 2 || player.position == 17 || player.position == 33)
    {
        // Bounty Chest
        const randomBounty = bountyChests[(Math.floor(Math.random() * bountyChests.length))]
        console.log(randomBounty.title)
        
        player.money -= randomBounty.pay
        player.money += randomBounty.earn

        // Display dice roll
        diceDisplay.textContent = randomBounty.title;
        diceOverlay.style.display = 'flex';
        
        setTimeout(() => {
            diceOverlay.style.display = 'none';
        }, 2000);

        endTurn()
        return
    }

    if(player.position == 7 || player.position == 23 || player.position == 36)
    {
        // Chance cards
        const randomChance = chanceCards[(Math.floor(Math.random() * chanceCards.length))]
        console.log(randomChance.title)
        
        player.money -= randomChance.pay
        player.money += randomChance.earn
        player.position = randomChance.advanceToPosition
        drawBoard()

        // Display dice roll
        diceDisplay.textContent = randomChance.title;
        diceOverlay.style.display = 'flex';
        
        setTimeout(() => {
            diceOverlay.style.display = 'none';
        }, 2000);

        endTurn()
        return
    }

    if(player.position == 4 || player.position == 38)
    {
        player.money -= 100

        endTurn()
        return
    }

    if(property.owner != currentPlayerIndex && property.owner !== ''){
        console.log('Pay up, you landed on others property')

        player.money -= property.price;
        players[Number(!currentPlayerIndex)].money += property.price

        endTurn();
    }
    else if (property.owner === currentPlayerIndex){
        // updgrade property
        console.log('Upgrade property option')
        endTurn();
    }
    else if (property && property.price > 0 && player.money >= property.price){
        promptText.textContent = `Do you want to buy ${property.name} for $${property.price}?`;
        overlay.style.display = 'flex';
        
    }else {
        endTurn();
    }

}

function sendToJail()
{
    players[currentPlayerIndex].prevPos = players[currentPlayerIndex].position
    players[currentPlayerIndex].position = 10
    drawBoard();
}   

function endTurn() {
    updatePlayerInfo();
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    rollDiceButton.disabled = false;
    updateRollDiceButton();
}

function updatePlayerInfo() {
    playerInfoDiv.innerHTML = players.map(player => 
        `${player.name}: $${player.money} (Position: ${player.position})`
    ).join('<br>');
}

function updateRollDiceButton() {
    rollDiceButton.textContent = `${players[currentPlayerIndex].name}'s Turn - Roll Dice`;
}

rollDiceButton.addEventListener('click', () => {
    rollDiceButton.disabled = true;
    movePlayer();
});

buyYesButton.addEventListener('click', () => {
    const player = players[currentPlayerIndex];
    const property = properties[player.position];
    player.money -= property.price;
    overlay.style.display = 'none';

    properties[player.position].owner = currentPlayerIndex
    console.log(currentPlayerIndex + ' owns ' + property.name)

    endTurn();
});

buyNoButton.addEventListener('click', () => {
    overlay.style.display = 'none';
    endTurn();
});

boardImage.onload = () => {
    useImageBoard = true;
    drawBoard();
    updatePlayerInfo();
    updateRollDiceButton();
};

boardImage.onerror = () => {
    useImageBoard = false;
    drawBoard();
    updatePlayerInfo();
    updateRollDiceButton();
};