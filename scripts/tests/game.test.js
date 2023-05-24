/**
 * @jest-environment jsdom
 */

const { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn, gameOver } = require('../game');

jest.spyOn(window, 'alert').mockImplementation(() => { });

beforeAll(() => {
    let fs = require('fs');
    let fileContents = fs.readFileSync('index.html', 'utf8');
    document.open();
    document.write(fileContents);
    document.close();
});

describe('game object contains correct keys', () => {
    test('score key exists', () => {
        expect('score' in game).toBe(true);
    });
    test("currentGame key exists", () => {
        expect("currentGame" in game).toBe(true);
    });
    test('playerMoves key exists', () => {
        expect('playerMoves' in game).toBe(true);
    });
    test('choices key exists', () => {
        expect('choices' in game).toBe(true);
    });
    test('choices contain correct ids', () => {
        expect(game.choices).toEqual(['button1', 'button2', 'button3', 'button4']);
    });
    test('turnNumber key exists', () => {
        expect('turnNumber' in game).toBe(true);
    }
    );
    test('turnInProgress key exists', () => {
        expect('turnInProgress' in game).toBe(true);
    }
    );
    test('turnInProgress key is false', () => {
        expect(game.turnInProgress).toBe(false);
    }
    );
    test('lastButton key exists', () => {
        expect('lastButton' in game).toBe(true);
    }
    );
});

describe('newGame works correctly', () => {
    beforeAll(() => {
        game.score = 42;
        game.currentGame = ['button1', 'button2'];
        game.playerMoves = ['button1', 'button2'];
        document.getElementById('score').innerText = '42';
        newGame();
    });
    test('score is reset to zero', () => {
        expect(game.score).toEqual(0);
    });
    test('playerMoves is reset to empty', () => {
        expect(game.playerMoves).toEqual([]);
    }
    );
    test("should add one move to the computer's game array", () => {
        expect(game.currentGame.length).toBe(1);
    });
    test('score element shows 0', () => {
        expect(document.getElementById('score').innerText).toEqual(0);
    }
    );
    test('turnNumber is set to zero', () => {
        expect(game.turnNumber).toEqual(0);
    }
    );
    test('expect data-listener to be set to true', () => {
        const elements = document.getElementsByClassName('circle');
        for (let element of elements) {
            expect(element.getAttribute('data-listener')).toEqual('true');
        }
    }
    );
});

describe('gameplay works correctly', () => {
    beforeEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
        addTurn();
    });
    afterEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
    });
    test('addTurn adds a new turn to the game', () => {
        addTurn();
        expect(game.currentGame.length).toBe(2);
    }
    );
    test('should add correct class to light up button', () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain('light');
    }
    );
    test('should remove correct class to light up button', () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        setTimeout(() => {
            expect(button.classList).not.toContain('light');
        }, 400);
    }
    );
    test('showTurns should update game.turnNumber', () => {
        game.turnNumber = 42;
        showTurns();
        expect(game.turnNumber).toBe(0);
});
    test('playerTurn should add move to playerMoves array', () => {
        playerTurn();
        expect(game.playerMoves.length).toBe(0);
    }
    );
    test('gameOver should alert the player', () => {
        window.alert = jest.fn();
        gameOver();
        expect(window.alert).toHaveBeenCalledWith('Game Over! You made it to level ' + game.score);
    }
    );
    test('should incement score if player wins', () => {
        game.playerMoves.push(game.currentGame[0]);
        playerTurn();
        expect(game.score).toBe(1);
    }
    );
    test('should call gameOver if player loses', () => {
        game.playerMoves.push('wrong');
        playerTurn();
        expect(game.score).toBe(0);
    }
    );
    test('should call an alert if player loses', () => {
        game.playerMoves.push('wrong');
        playerTurn();
        expect(window.alert).toHaveBeenCalledWith('Game Over! You made it to level ' + game.score);
    }
    );
    test('turnInProgress key is set to true during computer turn', () => {
        showTurns();
        expect(game.turnInProgress).toBe(true);
    }
    );
    test('clicking on a button during computer turn does nothing', () => {
        showTurns();
        game.lastButton = '';
        document.getElementById('button1').click();
        expect(game.lastButton).toBe('');
    }
    );
});