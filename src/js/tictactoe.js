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
            playerName.innerText = currentPlayer.name;
        })
        .then(json => console.log(json))
}

function hideElements() {
    startGameBtn.style.display = 'none';
    listPlayers.style.display = 'none';
    turnBanner.style.display = 'flex';
    board.style.display = 'flex';

}

turnBanner.style.display = 'none';
board.style.display = 'none';


function createNewMovement(idRound, player, position) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "ticTacToePlayer": {
            "player": {
                "idPlayer": player,
            },
            "piece": {
                "idPiece": 1,
                "name": "X"
            }
        },
        "position": {
            position
        }
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw
    };

    fetch(URL_TTT + 1, requestOptions)
        .then(response => response.json())
        .then(result => {
            currentPlayer = result.turn;
            playerName.innerText = " " + currentPlayer.name;
        })
        .catch(error => console.log('error', error));
}

function selectSquare(event) {
    createNewMovement()
    console.log(event.target.dataset.column);
    console.log(event.target.dataset.row);
    squares.disabled = false;
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