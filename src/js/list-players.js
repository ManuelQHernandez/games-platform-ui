

const URL_TODOS = "http://localhost:8080/api/players/";
const URL_DELETE = "http://localhost:8080/api/players/";

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
                <tr id="${element.idPlayer}">
                <td>${element.name.slice(0, 20)}</td>
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
          
          const result = confirm("Want to delete?");
          
          if(result) {
            deletePlayer(idPlayer);  
          } else {
            location.reload();
          }

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

  fetch((URL_DELETE + idPlayer), requestOptions)
    .then((response) => response.json({ message: 'Player delete'}))

    .then(() => location.reload())

    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}
