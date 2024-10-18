// //function startGame
// const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
// const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

const suits = ["C", "D", "H", "S"];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let deck, playerHand, dealerHand, playerScore, dealerScore, gameActive;
let dealerHiddenCard, dealerRevealed;

const playerCardsDiv = document.getElementById('player-cards');
const dealerCardsDiv = document.getElementById('dealer-cards');
const playerScoreDiv = document.getElementById('player-score');
const dealerScoreDiv = document.getElementById('dealer-score');
const resultDiv = document.getElementById('result');

document.getElementById('start').addEventListener('click', startGame);
document.getElementById('hit').addEventListener('click', playerHit);
document.getElementById('stand').addEventListener('click', stand);

function startGame() {
    deck = createDeck();
    shuffleDeck(deck);
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];
    dealerHiddenCard = drawCard();
    dealerRevealed = false;
    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand.concat([dealerHiddenCard]));
    // dealerScore = calculateScore(dealerHand);
    gameActive = true;

    updateUI();
    resultDiv.textContent = '';
}
// function Hit
function playerHit(){
    if(gameActive) {
        const newCard = drawCard();
        playerHand.push(newCard);
        playerScore = calculateScore(playerHand);

        updateUI();
        
        if (playerScore > 21) {
            resultDiv.textContent = "You bust!! Dealer wins";
            gameActive = false;
        }
    }

}

function dealerTurn() {
    if (gameActive) {

        dealerHand.push(dealerHiddenCard); 
        dealerRevealed = true;
        updateUI();

        while (dealerScore < 17) {
            dealerHand.push(drawCard()); 
            dealerScore = calculateScore(dealerHand); 
        }
        updateUI(); 
        
        if (dealerScore > 21) {
            resultDiv.textContent = 'Dealer busted! You win!';
        } else if (dealerScore > playerScore) {
            resultDiv.textContent = 'Dealer wins!';
        } else if (dealerScore < playerScore) {
            resultDiv.textContent = 'You win!';
        } else {
            resultDiv.textContent = 'It\'s a tie!';
        }
        
        gameActive = false; 
    }
}


function createDeck() {
    const deck = [];
    for (const suit of suits) {
        for (const value of values) {
            deck.push({ rank: value, suit: suit });
        }
    }
    return deck;
}


function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; 
    }
}

function drawCard() {
    return deck.pop(); 
}

function calculateScore(hand) {
    let score = 0;
    let acesCount = 0;

    for (const card of hand) {
        if (['J', 'Q', 'K'].includes(card.rank)) { 
            score += 10;
        } else if (card.rank === 'A') {
            score += 11; // ace treated as 11
            acesCount++;
        } else {
            score += parseInt(card.rank);
        }
    }

   
    while (score > 21 && acesCount > 0) {
        score -= 10; // Ace as 1 instead of 11
        acesCount--;
    }

    return score;
}

// function stand
function stand () {
    if (gameActive) {
        dealerTurn ();
    }
}
// // fucntion split 
const dropdownButton = document.querySelector('.split-dropdown-button');
const splitOptions = document.createElement('div');

splitOptions.innerHTML = `
    <button class="option">Confirm Split</button>
    <button class="option">Cancel Split</button>
`;
splitOptions.style.display = 'none';
splitOptions.classList.add('split-options');

dropdownButton.addEventListener('click', () => {
    splitOptions.style.display = splitOptions.style.display === 'none' ? 'block' : 'none';
});

document.querySelector('.blackjack-split-button').appendChild(splitOptions);
let playerHands = [[]]; 
let currentHandIndex = 0; 


playerHands[0] = [{ rank: '8', suit: 'hearts' }, { rank: '8', suit: 'spades' }];

function splitHand() {
    
    if (playerHands[currentHandIndex].length === 2 && 
        playerHands[currentHandIndex][0].rank === playerHands[currentHandIndex][1].rank) {
        
        
        const splitCard = playerHands[currentHandIndex].pop(); 
        playerHands.push([splitCard]); 

        
        console.log('Hand split! Current hands:', playerHands);
        
    } else {
        console.log('Cannot split this hand.');
    }
}

document.querySelector('.split-main-button').addEventListener('click', () => {
    splitHand();
});
function updateUI() {

    console.log('Update UI with hands:', playerHands);
    playerCardsDiv.innerHTML = playerHand.map(card => `<div>${card.rank} of ${card.suit}</div>`).join('');
    dealerCardsDiv.innerHTML = dealerHand.map(card => `<div>${card.rank} of ${card.suit}</div>`).join('');
    playerScoreDiv.textContent = `Score: ${playerScore}`;
    dealerScoreDiv.textContent = `Score: ${dealerScore}`;
}

//Adding Images
function updateUI() {
    playerCardsDiv.innerHTML = playerHand.map(card => {
        const cardImg = `<img src="Assets/${card.rank}-${card.suit}.png" alt="${card.rank} of ${card.suit}" class="card-image">`;
        return cardImg;
    }).join('');

    dealerCardsDiv.innerHTML = dealerHand.map(card => {
        const cardImg = `<img src="Assets/${card.rank}-${card.suit}.png" alt="${card.rank} of ${card.suit}" class="card-image">`;
        return cardImg;
    }).join('');

    if (gameActive && !dealerRevealed) {
        dealerCardsDiv.innerHTML += `<img src="Assets/BACK.png" alt="Hidden Card" class="card-image">`;
    }

    playerScoreDiv.textContent = `Score: ${playerScore}`;
    // dealerScoreDiv.textContent = `Score: ${dealerScore}`;
    dealerScoreDiv.textContent = dealerRevealed ? `Score: ${dealerScore}` : `Score: ?`;
}
