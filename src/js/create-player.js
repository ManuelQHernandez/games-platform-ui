//const URL_TODOS = "https://jsonplaceholder.typicode.com/todos/";
const URL_TODOS = "http://localhost:8080/api/players/";


const createPlayersbtn = document.querySelector("#createPlayer");


function createPlayer(newName, newType) {
  var formdata = new FormData();
  formdata.append("name", newName);
  formdata.append("typePlayer", newType);

  var requestOptions = {
    method: "POST",
    body: formdata,
  };

  fetch(URL_TODOS, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      
      //Here you will create the player
      
      console.log(result)
      alert('Player Added', 'success');
      window.location.href = "list-players.html";

    })
    .catch((error) => console.log("error", error));
}

createPlayersbtn.addEventListener("click", () => {
  const playerName = document.querySelector("#playerName")?.value;
  const typeChecked = document.querySelector("input[name=playerType]:checked")?.value;
  

  // Validate
  if(playerName == "" || !typeChecked)  {

    alert('Please fill in all fields');

  } else {
    console.log(typeChecked)
    console.log(playerName)
    createPlayer(playerName, typeChecked);
  }

  
});

