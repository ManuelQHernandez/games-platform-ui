const players = document.querySelector('#players tbody');
const startGameBtn = document.querySelector('#startGame');
const listPlayers = document.getElementById('players');
const turnBanner = document.getElementById('playerTurn');
const playerName = document.getElementById('currentPlayerName');
const squares = document.querySelectorAll('.Square');
const board = document.getElementById('board');

const URL_PLAYERS = 'http://localhost:8080/api/players/';
const URL_TTT = 'http://localhost:8080/api/ttt/';
const MAX_NUMBER_OF_PLAYERS = 2;

let checkBoxes = [];
let selectedPlayers = [];
let currentPlayer;
let currentIdRound;
let currentPiece;
let playerX;
let playerO;

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
            currentPlayer = result.turn;
            currentIdRound = result.idRound;
            playerName.innerText = currentPlayer.name;
            console.log(result);
        })
}

function hideElements() {
    startGameBtn.style.display = 'none';
    listPlayers.style.display = 'none';
    turnBanner.style.display = 'flex';
    board.style.display = 'flex';
}

turnBanner.style.display = 'none';
board.style.display = 'none';

function selectSquare(event) {
    let x = event.target.dataset.row;
    let y = event.target.dataset.column;

    playerX = selectedPlayers[0].value;
    playerO = selectedPlayers[1].value;

    if (currentPlayer.idPlayer == playerX) {
        let idPiece = 1;
        let name = 'X';
        currentPiece = {
            idPiece, name
        };
    } else if (currentPlayer.idPlayer == playerO) {
        let idPiece = 2;
        let name = 'O';
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

function changePiece(piece) {
    if ((piece.idPiece == 1) && (piece.name == 'X')) {
        piece.idPiece = 2;
        piece.name = 'O';
    } else {
        piece.idPiece = 1;
        piece.name = 'X';
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
            currentPlayer = result.turn;
            currentIdRound = result.idRound;
            playerName.innerText = currentPlayer.name;
            console.log(result);
        })
        .catch(error => console.log('error', error));
}

showPlayers();

startGameBtn.addEventListener('click', startGameHandler);

function validatePlayersBeforeStart() {
    const numberOfPlayers = [...checkBoxes].filter(checkbox => checkbox.checked).length;
    if (numberOfPlayers < MAX_NUMBER_OF_PLAYERS) {
        alert("You need to choose two players");
    }
    else {
        hideElements();
    }
}

startGameBtn.addEventListener('click', validatePlayersBeforeStart);
squares.forEach(square => square.addEventListener('click', selectSquare));