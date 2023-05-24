let game = {
    score : 0,
    currentGame : [],
    playerMoves : [],
    turnNumber : 0,
    turnInProgress : false,
    lastButton : '',
    choices : ['button1', 'button2', 'button3', 'button4'],
}

function newGame() {
    game.score = 0;
    game.currentGame = [];
    game.playerMoves = [];
    turnNumber = 0;

    for (let circle of document.getElementsByClassName('circle')) {
        if (circle.getAttribute('data-listener') !== 'true') {
            circle.addEventListener('click', (e) => {
                if (game.currentGame.length > 0 && !game.turnInProgress) {
                    let move = e.target.getAttribute('id');
                    lightsOn(move);
                    game.playerMoves.push(move);
                    playerTurn();
                }
            });
            circle.setAttribute('data-listener', 'true');
        }
    }
    showScore();
    addTurn();
}

function addTurn() {
    game.playerMoves = [];
    game.currentGame.push(game.choices[Math.floor(Math.random() * 4)]);
    showTurns();
}

function showTurns() {
    game.turnInProgress = true;
    game.turnNumber = 0;
    let turns = setInterval(function () {
        lightsOn(game.currentGame[game.turnNumber]);
        game.turnNumber++;
        if (game.turnNumber >= game.currentGame.length) {
            clearInterval(turns);
            game.turnInProgress = false;
        }
    }, 800);
}

function showScore() {
    document.getElementById('score').innerText = game.score;
}

function lightsOn(circ) {
    document.getElementById(circ).classList.add('light');
    setTimeout(function () {
        document.getElementById(circ).classList.remove('light');
    }, 400);
}

function playerTurn() {
    let i = game.playerMoves.length - 1;
    if (game.playerMoves[i] !== game.currentGame[i]) {
        gameOver();
        return;
    }
    if (game.playerMoves.length === game.currentGame.length) {
        game.score++;
        showScore();
        addTurn();
    }
}

function gameOver() {
    alert('Game Over! You made it to level ' + game.score);
    game.currentGame = [];
    game.playerMoves = [];
    showScore();
}

module.exports = { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn, gameOver };