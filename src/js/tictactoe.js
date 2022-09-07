//API ROUTES------------------------------------------------------------------------------------------------------------------------
const URL_PLAYERS = 'http://localhost:8080/api/players/';
const URL_TTT = 'http://localhost:8080/api/ttt/';

//SHOW PLAYERS------------------------------------------------------------------------------------------------------------------------
const players = document.querySelector('#players tbody');
const startGameBtn = document.querySelector('#startGame');
const listPlayers = document.getElementById('players');
const MAX_NUMBER_OF_PLAYERS = 2;

//SHOW BOARD------------------------------------------------------------------------------------------------------------------------
const turnBanner = document.getElementById('playerTurn');
const playerName = document.getElementById('currentPlayerName');
const squares = document.querySelectorAll('.Square');
const board = document.getElementById('board');

//SHOW PLAYER-PIECE----------------
const playerNameX = document.getElementById('player-X');
const playerNameO = document.getElementById('player-O');
const playersPieces = document.getElementById('players-turns');

//SHOW WINNER------------------------------------------------------------------------------------------------------------------------
const welcome = document.getElementById('welcome');
const gameStatusTTT = document.getElementById('game-statusTTT');
const winnerPlayer = document.getElementById('winner-player');
const winnerPanel = document.getElementById('winner-ttt-panel');

//GLOBAL VALUES----------------------------------------------------------------------------------------------------------------------
let checkBoxes = [];
let selectedPlayers = [];
let currentPlayer;
let currentIdRound;
let currentPiece;
let playerX;

function firstView() {
    turnBanner.style.display = 'none';
    board.style.display = 'none';
    gameStatusTTT.style.display = 'none';
    playersPieces.style.display = 'none';
    winnerPlayer.style.display = 'none';
    winnerPanel.style.display = 'none';
}

function showPlayers() {
    const requestOptions = {
        method: "GET",
    };
    fetch(URL_PLAYERS, requestOptions)

        .then((response) => response.json())

        .then((json) => {
            return json
                .map((element) => {
                    return `
                            <tr id="${element.idPlayer}">
                                <td class="tableData">${element.name}</td>
                                <td>
                                    <input class="option-input" type="checkbox" value=${element.idPlayer} name="playerSelected">
                                </td>
                            </tr>
                            `;
                })
                .slice(0, 10)
                .join("");
        })
        .then(result => players.innerHTML = result)
        .then(() => checkBoxes = document.querySelectorAll('[name=playerSelected]'))
        .then(() => checkBoxes.forEach(checkBox => checkBox.addEventListener("click", checkCheckBoxes)));
}

function checkCheckBoxes() {
    const numberOfPlayers = [...checkBoxes].filter(checkbox => checkbox.checked).length;
    if (numberOfPlayers >= MAX_NUMBER_OF_PLAYERS)
        checkBoxes.forEach(checkbox => !checkbox.checked ? checkbox.disabled = true : "");
    else
        checkBoxes.forEach(checkbox => checkbox.disabled = false);
}

function startGameHandler() {
    selectedPlayers = [...checkBoxes].filter(checkBox => checkBox.checked);
    if (selectedPlayers.length !== MAX_NUMBER_OF_PLAYERS) return;
    const [player1, player2] = [...selectedPlayers];
    createNewTurn(player1.value, player2.value);
}

function createNewTurn(player1, player2) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify([
        {
            "idPlayer": player1
        },
        {
            "idPlayer": player2
        }
    ]);

    const requestOptions = {
        method: "POST",
        body: raw,
        headers: myHeaders
    };

    fetch(URL_TTT, requestOptions)
        .then(response => response.json())
        .then(result => {
            currentPlayer = result.round.turn;
            playerX = currentPlayer;
            currentIdRound = result.idTicTacToeRound;
            playerName.innerText = currentPlayer.name + ' ';
            assignPieces(result);
        })
}

function assignPieces(result) {
    setTimeout(() => displayTurns(), 3000);

    playerNameX.innerText = playerX.name;
    if (result.round.player1.name != playerX.name) {
        playerNameO.innerText = result.round.player1.name;
    }
    else if (result.round.player2.name != playerX.name) {
        playerNameO.innerText = result.round.player2.name;
    }
}

function displayTurns() {
    playersPieces.style.display = 'none';
    turnBanner.style.display = 'flex';
}

function secondView() {
    displayTurns();
    startGameBtn.style.display = 'none';
    listPlayers.style.display = 'none';
    welcome.style.display = 'none';

    gameStatusTTT.style.display = 'flex';
    playersPieces.style.display = 'flex';
    board.style.display = 'flex';
    gameStatusTTT.display = 'flex';
}

function selectSquare(event) {
    let x = event.target.dataset.row;
    let y = event.target.dataset.column;
    let idPiece;
    let name;

    if (playerX.idPlayer == currentPlayer.idPlayer) {
        idPiece = 1;
        name = "X";
        currentPiece = {
            idPiece, name
        };
    } else {
        idPiece = 2;
        name = "O";
        currentPiece = {
            idPiece, name
        };
    }

    var position = {
        x, y
    };

    createNewMovement(currentIdRound, currentPlayer, position, currentPiece);
    putPiece(x, y, currentPiece);
}

function putPiece(x, y, piece) {
    var positionPutPiece = document.getElementById(x + y);
    if (x == undefined && y == undefined) {
        alert('This possitin is not valid')
    }
    else {
        positionPutPiece.setAttribute("src", "src/assets/ttt/" + piece.name + ".png");
    }
}

function createNewMovement(idRound, player, position, piece) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "ticTacToePlayer":
        {
            player, piece
        },
        position
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw
    };

    fetch(URL_TTT + idRound, requestOptions)
        .then(response => response.json())
        .then(result => {
            currentPlayer = result.round.turn;
            playerName.innerText = currentPlayer.name;
            showWinner(result);
        })
        .catch(error => console.log('error', error));
}

function gameResult() {
    gameStatusTTT.style.display = 'flex';
    winnerPlayer.style.display = 'flex';
    winnerPanel.style.display = 'flex';

    turnBanner.style.display = 'none';
    playersPieces.style.display = 'none';
}

function showWinner(res) {
    let winner = res.round.winner;

    if (res.round.finished == true && res.round.winner != null) {
        gameResult();
        winnerPlayer.innerText = 'Congratulations ' + winner.name + ' you won this round';
    }
    else if (res.round.finished == true && res.round.winner == null) {
        gameResult();
        winnerPlayer.innerText = 'It was a tie';
    }
}

function validatePlayersBeforeStart() {
    const numberOfPlayers = [...checkBoxes].filter(checkbox => checkbox.checked).length;
    if (numberOfPlayers < MAX_NUMBER_OF_PLAYERS) {
        alert("You need to choose two players");
    }
    else {
        secondView();
    }
}

firstView();
showPlayers();
startGameBtn.addEventListener('click', startGameHandler);
startGameBtn.addEventListener('click', validatePlayersBeforeStart);
squares.forEach(square => square.addEventListener('click', selectSquare));