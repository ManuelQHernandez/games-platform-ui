

const URL_TODOS = "https://jsonplaceholder.typicode.com/todos/";
const URL_POSTS = "https://jsonplaceholder.typicode.com/posts/";

const tablePlayers = document.querySelector("#players tbody");
let deletePlayersBtn;

getListOfPlayers();

function getListOfPlayers() {
  let requestResult = [];

  fetch(URL_TODOS)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      requestResult = json
        .map((element) => {
          return `      
                <tr id="${element.id}">
                <td>${element.title.slice(0, 20)}</td>
                <td class="tableData"><button class="delete-btn">Delete</button></td>
                </tr>
                `;
        })
        .join("");
      tablePlayers.innerHTML = requestResult;
    })
    .then(() => (deletePlayersBtn = document.querySelectorAll(".delete-btn")))
    .then(() =>
      deletePlayersBtn.forEach((btn) =>
        btn.addEventListener("click", (e) => {
          const idPlayer = e.target.parentElement.parentElement.id;
          deletePlayer(idPlayer);
        })
      )
    );
}

function deletePlayer(idPlayer) {
  var formdata = new FormData();

  var requestOptions = {
    method: "DELETE",
    body: formdata,
    redirect: "follow",
  };

  fetch((URL_POSTS + idPlayer), requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}
