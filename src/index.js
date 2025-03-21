let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys();


  handleFormSubmit();
});

//fetch Toys
function fetchToys(){
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => toys.forEach(toy => renderToy(toy)))
    .catch(error => console.error("Error fetching toys:", error));
}

// render Toy

function renderToy(toy) {
  const toyCollection = document.getElementById("toy-collection");

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
  <h2>${toy.name}</h2>
  <img src = "${toy.image}" class="toy-avatar" />
  <p>${toy.likes} Likes</p>
  <button class = "like-btn" data-id="${toy.id}">Like ❤️ </button>
  `;
  toyCollection.appendChild(card);

  const likeBtn = card.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => increasesLikes(toy, card));
}

function handleFormSubmit(){
  const form = document.querySelector(".add-toy-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const newToy = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body : JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => renderToy(toy))
    .catch(error => console.error("Error adding toy:", error));
  
    form.reset();
  });
}

//increase Likes

function increasesLikes(toy, card) {
  const newLikes = toy.likes +1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({likes: newLikes})
  })
  .then(response => response.json())
  .then(updatedToy => {
    toy,likes = updatedToy.likes;
    card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
  })
  .catch(error => console.error ("Error updating likes:", error));
}