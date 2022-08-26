const players = document.querySelector('#players tbody');
const URL_TODOS = 'https://jsonplaceholder.typicode.com/todos';

function showPlayers() {

    var requestOptions = {
        method: "GET",

    };

    fetch(URL_TODOS,requestOptions)
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            requestResult = json
                .map((element) => {
                    return `
                <tr id="${element.id}">
                <td>${element.title.slice(0, 10)}</td>
                <td><input type="checkbox" value=${element.id} name="playerSelected"></td>
                </tr>
                `;
                })
                .slice(0, 10)
                .join("");
            players.innerHTML = requestResult;
        });
}

showPlayers();