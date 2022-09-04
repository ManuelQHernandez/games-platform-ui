// const URL_TODOS = 'https://jsonplaceholder.typicode.com/todos/';
const URL_ROUNDS = 'http://localhost:8080/api/hm/';//-------------------------------------------
const URL_PLAYERS = 'http://localhost:8080/api/players/';

const welcome = document.getElementById('welcome');
const turn = document.getElementById('turn');
const players = document.querySelector('#players tbody');
const startGameBtn = document.querySelector('#startGame');
const listPlayers = document.getElementById('players');
const currentPlayerName = document.getElementById('current-player-name');
//-----------------------------------------------------------------------------
const playersTurns = document.getElementById('players-turns');
const giverName = document.getElementById('giver-name');
const guesserName = document.getElementById('guesser-name');
const hangedManPanel = document.getElementById('hanged-man-panel');
const secretWordForm = document.getElementById('secret-word-form');
const secretWordInput = document.getElementById('secret-word-input');
const giveSecretWordBtn = document.getElementById('give-secret-word-btn');
const hangedManBoard = document.getElementById('hanged-man-board');
const secretWordDisplay = document.getElementById('secret-word-display');
const hangedMan = document.getElementById('hanged-man');
const letterForm = document.getElementById('letter-form');
const letterInput = document.getElementById('letter-input');
const giveLetterBtn = document.getElementById('give-letter-btn');
//-----------------------------------------------------------------------------

const NUMBER_OF_PLAYERS = 2;

let checkBoxes = [];
let selectedPlayers = [];
let currentPlayer;
let currentIdRound;

turn.style.display = 'none';
//-----------------------------------------------------------------------------
playersTurns.style.display = 'none';
hangedManPanel.style.display = 'none';
secretWordForm.style.display = 'none';
hangedManBoard.style.display = 'none';
letterForm.style.display = 'none';
//-----------------------------------------------------------------------------

function showPlayers() {
    const requestOptions = {
        method: "GET"
    };
    fetch(URL_PLAYERS, requestOptions)
        .then((response) => response.json())
        .then((json) => {
            return json
                .map((element) => {
                    return `
                            <tr id="${element.idPlayer}">
                                <td class="tableData">${element.name}</td>
                                <td class="tableData">${element.typePlayer.name}</td>
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
    if (numberOfPlayers >= NUMBER_OF_PLAYERS)
        checkBoxes.forEach(checkbox => !checkbox.checked ? checkbox.disabled = true : "");
    else
        checkBoxes.forEach(checkbox => checkbox.disabled = false);
}

function startGameHandler() {
    selectedPlayers = [...checkBoxes].filter(checkBox => checkBox.checked);
    if (selectedPlayers.length !== NUMBER_OF_PLAYERS) return;
    const [player1, player2] = [...selectedPlayers];
    createNewTurn(player1.value, player2.value);
}

function createNewTurn(player1, player2) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify([{ "idPlayer": player1 }, { "idPlayer": player2 }]);

    const requestOptions = {
        method: "POST",
        body: raw,
        headers: myHeaders
    };

    fetch(URL_ROUNDS, requestOptions)
        .then(response => response.json())
        .then(result => {
            assignTurnData(result.round);
            changeTurnLabels();
        });
}

function assignTurnData(round) {
    currentPlayer = round.turn;
    currentIdRound = round.idRound;
    giverName.innerText = round.player1.name;
    guesserName.innerHTML = round.player2.name;
    currentPlayerName.innerText = currentPlayer.name;
}

function changeTurnLabels() {
    welcome.style.display = 'none';
    playersTurns.style.display = 'block';
    startGameBtn.style.display = 'none';
    listPlayers.style.display = 'none';
    setTimeout(() => {
        playersTurns.style.display = 'none';
        turn.style.display = 'flex';
        hangedManPanel.style.display = 'flex';//------------------------------------------------------------
        secretWordForm.style.display = 'block';//------------------------------------------------------------
    }, 10000);
}

function validatePlayersBeforeStart() {
    const numberOfPlayers = [...checkBoxes].filter(checkbox => checkbox.checked).length;
    if (numberOfPlayers < NUMBER_OF_PLAYERS) {
        alert("You need to choose two players");
    }
}

startGameBtn.addEventListener('click', startGameHandler);
startGameBtn.addEventListener('click', validatePlayersBeforeStart);
giveSecretWordBtn.addEventListener('click', handleChooseOption);
giveLetterBtn.addEventListener('click', handleChooseOption);

showPlayers();

//-------------------------------------------------------------------------------------------

function handleChooseOption(e) {
    let secretWord;
    let option;
    if (e.target === giveSecretWordBtn) {
        secretWord = secretWordInput.value;
        option = 'secretWord';
    } else if (e.target === giveLetterBtn) {
        secretWord = letterInput.value;
        option = 'letter';
    }
    chooseOption(secretWord, currentPlayer, option);
    secretWordInput.value = '';
    letterInput.value = '';
    letterInput.focus();
}

function chooseOption(secretWord, player, option) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const letters = secretWord
        .split('')
        .map((letter, index) => {
            return {
                "idHangManRound": currentIdRound,
                "character": letter,
                "position": (index + 1),
                "isShown": false
            };
        });

    console.log(letters);

    var raw = JSON.stringify({ player, letters });

    const requestOptions = {
        method: "POST",
        body: raw,
        headers: myHeaders
    };

    fetch(URL_ROUNDS + currentIdRound + `/${option}/`, requestOptions)
        .then(response => response.json())
        .then(result => {
            currentPlayer = result.round.turn;
            currentPlayerName.innerText = currentPlayer.name;
            if (result.secretWord != null) {
                secretWordForm.style.display = 'none';
                hangedManBoard.style.display = 'flex';
                letterForm.style.display = 'block';
            }
            console.log(result);
            return result;
        })
        .then(result => {
            const figureParts = document.querySelectorAll('.figure-part');
            const failedAttempts = result.failedAttempts;
            figureParts.forEach((part, index) => {
                if (index < failedAttempts) {
                    part.style.display = 'block';
                } else {
                    part.style.display = 'none';
                }
            });
            return result;
        })
        .then(result => displaySecretWord(result.secretWord));
}

function displaySecretWord(secretWord = []) {
    const letters = secretWord
        .map(letter => {
            return `
                <span class='letter-display'>${letter.isShown ? letter.character : ''}</span>
            `;
        })
        .join('');
    secretWordDisplay.innerHTML = letters;
}
