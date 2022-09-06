//-----------------------------------------------------------------------------------------------------------------------------------------------BEGIN
const URL_ROUNDS = 'http://localhost:8080/api/hm/';
//-----------------------------------------------------------------------------------------------------------------------------------------------END
const URL_PLAYERS = 'http://localhost:8080/api/players/';

const welcome = document.getElementById('welcome');
const turn = document.getElementById('turn');
const players = document.querySelector('#players tbody');
const startGameBtn = document.querySelector('#startGame');
const listPlayers = document.getElementById('players');
const currentPlayerName = document.getElementById('current-player-name');
const gameStatus = document.getElementById('game-status');
const winner = document.getElementById('winner');
const playersTurns = document.getElementById('players-turns');
//-----------------------------------------------------------------------------------------------------------------------------------------------BEGIN
const giverName = document.getElementById('giver-name');
const guesserName = document.getElementById('guesser-name');
const hangedManPanel = document.getElementById('hanged-man-panel');
const secretWordForm = document.getElementById('secret-word-form');
const secretWordInput = document.getElementById('secret-word-input');
const giveSecretWordBtn = document.getElementById('give-secret-word-btn');
const hangedManBoard = document.getElementById('hanged-man-board');
const secretWordDisplay = document.getElementById('secret-word-display');
const hangedMan = document.getElementById('hanged-man');
const selectedLetter = document.getElementById('selected-letter');
const letterForm = document.getElementById('letter-form');
const letterInput = document.getElementById('letter-input');
const giveLetterBtn = document.getElementById('give-letter-btn');
//-----------------------------------------------------------------------------------------------------------------------------------------------END

const NUMBER_OF_PLAYERS = 2;

let checkBoxes = [];
let selectedPlayers = [];
let currentPlayer;
let currentIdRound;

playersTurns.style.display = 'none';
turn.style.display = 'none';
gameStatus.style.display = 'none';
winner.style.display = 'none';
//-----------------------------------------------------------------------------------------------------------------------------------------------BEGIN
secretWordForm.style.display = 'none';
hangedManBoard.style.display = 'none';
letterForm.style.display = 'none';
selectedLetter.style.display = 'none';
hangedManPanel.style.display = 'none';
//-----------------------------------------------------------------------------------------------------------------------------------------------END

function sendHttpRequest(url, method = 'GET', body = {}, headers = {}) {
    const requestOptions = method === 'GET' ? { method } : { method, body, headers };
    return fetch(url, requestOptions)
        .then(result => result.json());
}

function showPlayers() {
    sendHttpRequest(URL_PLAYERS)
        .then((result) => generatePlayersTableRows(result))
        .then(result => players.innerHTML = result)
        .then(() => checkBoxes = document.querySelectorAll('[name=playerSelected]'))
        .then(() => checkBoxes.forEach(checkBox => checkBox.addEventListener("click", checkCheckBoxes)));
}

function generatePlayersTableRows(json) {
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
        .join("");
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
    const body = JSON.stringify([{ "idPlayer": player1 }, { "idPlayer": player2 }]);
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    sendHttpRequest(URL_ROUNDS, 'POST', body, headers)
        .then(result => displayNextForm(result));
}

//-----------------------------------------------------------------------------------------------------------------------------------------------BEGIN

function displayNextForm(result) {
    assignTurnData(result.round);
    displayPlayersTurns();
    if (currentPlayer.typePlayer.name === 'Bot')
        setTimeout(() => giveRandomWord(), 5000);
    else
        setTimeout(() => displaySecretWordForm(), 5000);
    return result;
}

function assignTurnData(round) {
    currentPlayer = round.turn;
    currentIdRound = round.idRound;
    giverName.innerText = round.player1.name;
    guesserName.innerHTML = round.player2.name;
    currentPlayerName.innerText = currentPlayer.name;
}

function giveRandomWord() {
    const url = "https://random-words-api.vercel.app/word";
    sendHttpRequest(url)
        .then(result => {
            secretWordInput.value = result[0].word.toLowerCase();
            giveSecretWordBtn.dispatchEvent(new Event("click"));
            displaySecretWordForm();
            displayLettersForm();
        })
        .catch(error => console.log('error', error));
}

function displayPlayersTurns() {
    welcome.style.display = 'none';
    playersTurns.style.display = 'block';
    startGameBtn.style.display = 'none';
    listPlayers.style.display = 'none';
}

function displaySecretWordForm() {
    playersTurns.style.display = 'none';
    turn.style.display = 'flex';
    hangedManPanel.style.display = 'flex';
    secretWordForm.style.display = 'block';
}

function handleHumanChooseOption(e) {
    let chosenLetters, option;
    if (e.target === giveSecretWordBtn) {
        chosenLetters = secretWordInput.value;
        option = 'secretWord';
    } else if (e.target === giveLetterBtn) {
        chosenLetters = letterInput.value;
        selectedLetter.innerText = chosenLetters;
        setTimeout(() => selectedLetter.innerText = '', 3000);
        option = 'letter';
    }
    if (chosenLetters === '') return;
    chooseOption(chosenLetters, currentPlayer, option);
    resetInputFields();
    chooseLetterButtonEventHandler();
}

function resetInputFields() {
    secretWordInput.value = '';
    letterInput.value = '';
    letterInput.focus();
}

function chooseLetterButtonEventHandler() {
    if (currentPlayer.typePlayer.name === 'Bot') {
        giveLetterBtn.removeEventListener('click', handleHumanChooseOption);
        giveLetterBtn.addEventListener('click', handleBotChooseOption);
    } else if (currentPlayer.typePlayer.name === 'Human') {
        giveLetterBtn.removeEventListener('click', handleBotChooseOption);
        giveLetterBtn.addEventListener('click', handleHumanChooseOption);
    }
}

function handleBotChooseOption(e) {
    letterInput.value = giveRandomLetter();
    handleHumanChooseOption(e);
}

function giveRandomLetter() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    return alphabet[Math.floor(Math.random() * 26)];
}

function chooseOption(secretWord, player, option) {
    const url = URL_ROUNDS + currentIdRound + `/${option}/`;
    const letters = generateLetterObjects(secretWord);
    const body = JSON.stringify({ player, letters });
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    sendHttpRequest(url, 'POST', body, headers)
        // .then(result => {console.log(result); return result;})
        .then(result => displayHangManBoard(result))
        .then(result => drawHangedMan(result))
        .then(result => displayLettersForm(result))
        .then(result => displaySecretWord(result))
        .then(result => result.round.finished ? displayWinnerLabels(result) : '');
}

function generateLetterObjects(word) {
    return word
        .split('')
        .map((letter, index) => {
            return {
                "idHangManRound": currentIdRound,
                "character": letter,
                "position": (index + 1),
                "isShown": false
            };
        });
}

function displayHangManBoard(result) {
    if (result.round === undefined) return result;
    currentPlayer = result.round.turn;
    currentPlayerName.innerText = currentPlayer.name;
    return result;
}

function displayLettersForm(result) {
    secretWordForm.style.display = 'none';
    letterForm.style.display = 'block';
    selectedLetter.style.display = 'block';
    hangedManBoard.style.display = 'flex';
    if (currentPlayer.typePlayer.name === 'Bot')
        letterInput.style.display = 'none';
    return result;
}

function drawHangedMan(result) {
    const figureParts = document.querySelectorAll('.figure-part');
    const failedAttempts = result.failedAttempts;
    figureParts.forEach((part, index) => {
        if (index < failedAttempts)
            part.style.display = 'block';
        else
            part.style.display = 'none';
    });
    return result;
}

function displaySecretWord(word = []) {
    const letters = word.secretWord
        .map(letter => {
            return `
                <span class='letter-display'>${letter.isShown ? letter.character : ''}</span>
                `;
        })
        .join('');
    secretWordDisplay.innerHTML = letters;
    selectedLetter.style.display = 'block';
    return word;
}

function displayWinnerLabels(result) {
    const round = result.round;
    turn.style.display = 'none';
    gameStatus.style.display = 'block';
    gameStatus.innerText = 'Game Over!';
    winner.style.display = 'block';
    winner.innerText = 'Winner is ' + round.winner.name;
    playersTurns.style.display = 'none';
    letterForm.style.display = 'none';
    if (result.failedAttempts >= result.max_NUMBER_OF_ATTEMPTS)
        secretWordDisplay.style.display = 'none';
    else
        hangedMan.style.display = 'none';
    return result;
}
//-----------------------------------------------------------------------------------------------------------------------------------------------END

giveSecretWordBtn.addEventListener('click', handleHumanChooseOption);
giveLetterBtn.addEventListener('click', handleHumanChooseOption);
startGameBtn.addEventListener('click', startGameHandler);

showPlayers();
