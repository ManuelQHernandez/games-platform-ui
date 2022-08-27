const players = document.querySelector('#players tbody');
const startGameBtn = document.querySelector('#startGame');
const URL_TODOS = 'https://jsonplaceholder.typicode.com/todos/';
const MAX_NUMBER_OF_PLAYERS = 2;
let checkBoxes = [];
let selectedPlayers = [];

function showPlayers() {
    const requestOptions = {
        method: "GET",
    };
    fetch(URL_TODOS, requestOptions)
        .then((response) => response.json())
        .then((json) => {
            return json
                .map((element) => {
                    return `
                            <tr id="${element.id}">
                                <td class="tableData">${element.title.slice(0, 10)}</td>
                                <td>
                                    <input type="checkbox" value=${element.id} name="playerSelected">
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
    const formdata = new FormData();
    formdata.append("player1", player1);
    formdata.append("player2", player2);

    const requestOptions = {
        method: "POST",
        body: formdata,
    };    

    fetch(URL_TODOS, requestOptions)
        .then(response => response.json())
        .then(json => console.log(json));
}        

startGameBtn.addEventListener('click', startGameHandler);

showPlayers();
