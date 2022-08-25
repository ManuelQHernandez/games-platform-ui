function getListOfPlayers() {
  var requestOptions = {
    method: "GET",
  };

  fetch("https://jsonplaceholder.typicode.com/todos", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

function deletPlayer(idPlayer) {
  var formdata = new FormData();
  formdata.append("id", idPlayer);
  //formdata.append("idPlayer", idPlayer);

  var requestOptions = {
    method: "DELETE",
    body: formdata,
    redirect: "follow",
  };

  fetch("https://jsonplaceholder.typicode.com/todos", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

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
