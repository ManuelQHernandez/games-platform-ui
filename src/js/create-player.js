const URL_TODOS = "https://jsonplaceholder.typicode.com/todos/";

const playerName = document.querySelector("#playerName");
const createPlayersbtn = document.querySelector("#createPlayer");

function createPlayer(newName, newType) {
  var formdata = new FormData();
  formdata.append("name", newName);
  formdata.append("type", newType);

  var requestOptions = {
    method: "POST",
    body: formdata,
  };

  fetch(URL_TODOS, requestOptions)
    .then((response) => response.text())
    .then((result) =>
      //Here you will create the player
      console.log(result)
    )
    .catch((error) => console.log("error", error));
}

createPlayersbtn.addEventListener("click", () => {
  const typeChecked = document.querySelector(
    "input[name=playerType]:checked"
  ).value;
  createPlayer(playerName, typeChecked);
});
