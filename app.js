var origBoard;
const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]
const humanScore = document.querySelector('.human');
const aiScore = document.querySelector('.ai');
const cells = document.querySelectorAll('.cell');
const end = document.querySelector('.end');
const modes = document.getElementById('mode');
const text = document.querySelector('.end .text');

var mode = (modes.value);

var hscore = 0;
var ascore = 0;
var hasWinner = false;

modes.addEventListener('change', e => {
    mode = e.target.value;
    startGame();
    scorer(0, 0);
    hscore = 0;
    ascore = 0;
})

startGame();

function startGame() {
    end.style.display = 'none';
    origBoard = Array.from(Array(9).keys());
    
    for(let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
    hasWinner = false;
}

function turnClick(square) {
    if(typeof origBoard[square.target.id] == 'number'){
        turn(square.target.id, humanPlayer);  
        if(!checkTie() && !hasWinner) turn(bestSpot(), aiPlayer)
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWinner(origBoard, player);
    if(gameWon) gameOver(gameWon)
}

function checkWinner(board, player){
    let plays = board.reduce((a, e, i) => 
     (e === player) ? a.concat(i) : a, []);
     console.log(plays);
    let gameWon = null;
    for(let [index, win] of winCombos.entries()) {   
        if(win.every(elem => plays.indexOf(elem) > -1)){
            gameWon = {index: index, player: player};       
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor =
            gameWon.player == humanPlayer ? "royalblue" : "red";
            
    }
    
    for(let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    gameWon.player === humanPlayer ? hscore++ : ascore++;
    scorer(hscore, ascore);
    declareWinner(gameWon.player == humanPlayer ? "You win!" : "You Lose!");
}
function scorer(human, ai){
    humanScore.innerText = human;
    aiScore.innerText = ai;
}
function declareWinner(who){
    end.style.display ="block";
    text.innerText = who;
    hasWinner = true;
}

function emptySquares(){
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return mode === "impossible" ? minimax(origBoard, aiPlayer).index 
        :  mode === "medium" ? (emptySquares()[Math.floor(Math.random() *  emptySquares().length)])  : emptySquares()[0]; 
}

function checkTie(){
    if(emptySquares().length === 0 && !hasWinner){
        for(var i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie !");
        return true;
    }
    return false;
}

function minimax(newBoard, player){
    var availSpots = emptySquares(newBoard);
    
    if(checkWinner(newBoard, humanPlayer)){
        return { score: -10};
    } else if(checkWinner(newBoard, aiPlayer)){
        return {score: 10};
    } else if(availSpots.length == 0){
        return {score: 0};
    }

    var moves = [];
    for(var i = 0; i < availSpots.length; i++){
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if(player == aiPlayer){
            move.score = minimax(newBoard, humanPlayer).score;
        } else {
            move.score = minimax(newBoard, aiPlayer).score;
        }
        newBoard[availSpots[i]] = move.index;
        if((player === aiPlayer && move.score === 10) || (player === humanPlayer && move.score === -10)){
            return move;
        } else {
            moves.push(move);
        }
    }

    var bestMove, bestScore;
    
    if(player === aiPlayer){
        var bestScore = -1000;
        for(var i = 0; i < moves.length; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for(var i = 0; i < moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}