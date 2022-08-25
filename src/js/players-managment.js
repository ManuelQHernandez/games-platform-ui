const URL = "https://jsonplaceholder.typicode.com/todos";
let deletePlayersbtn = [];
getListOfPlayers();
const tablePlayers = document.querySelector("#players tbody");
const createPlayersbtn = document.querySelector("#createPlayer");
const playerName = document.querySelector("#playerName");
const playerType = document.querySelector("#playerName");

deletePlayersbtn.forEach((btn) => (btn.onclick = () => console.log("Hi")));



function getListOfPlayers() {
  let requestResult = [];

  fetch(URL)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      requestResult = json

        .map((element) => {
          return `
           <tr id="${element.id}">
            <td>${element.title}</td>
            <td><button class="delete-btn">Delete</button></td>
          </tr>
        `;
        })
        .join("");
      tablePlayers.innerHTML = requestResult;
      deletePlayersbtn = document.querySelectorAll(".delete-btn");
    });
}

function deletePlayer(idPlayer) {
  var formdata = new FormData();

  var requestOptions = {
    method: "DELETE",
    body: formdata,
    redirect: "follow",
  };

  fetch(
    "https://jsonplaceholder.typicode.com/posts/" + idPlayer,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

/*function bridgeDeletePlayer(e) {
  console.log("Hola");
  console.log(e.target);
  //deletePlayer();
}
*/
function createPlayer(newName, newType) {
  var formdata = new FormData();
  formdata.append("name", newName);
  formdata.append("type", newType);

  var requestOptions = {
    method: "POST",
    body: formdata,
  };

  fetch("https://jsonplaceholder.typicode.com/todos", requestOptions)
    .then((response) => response.text())
    .then((result) =>
      //Here you will create the player
      console.log(result)
    )
    .catch((error) => console.log("error", error));
}

createPlayersbtn.addEventListener("click",bridgecreatePlayer);

function bridgecreatePlayer(e) {
  console.log("Hola");
  console.log(e.target.id);

}
