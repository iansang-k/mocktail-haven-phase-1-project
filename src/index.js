const allRecipes = [];
let searchInput;

document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-button");
  searchInput = document.getElementById("search-input");
  const recipeForm = document.getElementById("recipe-form");

  recipeForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newRecipe = {
      name: document.getElementById("recipe-name").value,
      image: document.getElementById("recipe-image").value,
      ingredients: document
        .getElementById("recipe-ingredients")
        .value.split(",")
        .map((item) => item.trim()),
      instructions: document
        .getElementById("recipe-instructions")
        .value.split(",")
        .map((item) => item.trim()),
      likes: 0,
      liked: false,
    };
    // adding new recipe to local array
    allRecipes.push(newRecipe);

    //use POST to send to backend
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "User-Agent": "EchoapiRuntime/1.1.0",
        Connection: "keep-alive",
      },
      body: JSON.stringify(newRecipe),
    };

    fetch("http://localhost:3000/recipes", options)
      .then((response) => response.json())
      .then((data) => {
        recipeForm.reset();
        displayRecipes(allRecipes);
      })
      .catch((err) => console.error(err));
  });

  //Fetching recipes from db.json
  const options = {
    method: "GET",
    headers: {
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "User-Agent": "EchoapiRuntime/1.1.0",
      Connection: "keep-alive",
    },
  };
  fetch("http://localhost:3000/recipes", options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      allRecipes.push(...data);
      displayRecipes(data);
    })
    .catch((err) => console.error(err));

  //Adding an event listener for the search button click event
  searchButton.addEventListener("click", search);
});

//Search function
function search() {
  const searchValue = searchInput.value.toLowerCase().trim();

  if (searchValue === "") {
    //If search is empty, display all recipes
    displayRecipes(allRecipes);
    return;
  }

  //Filter recipes based on search value
  const filteredRecipes = allRecipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchValue) ||
      recipe.ingredients.some((ingredients) =>
        ingredients.toLowerCase().includes(searchValue)
      )
  );
  displayRecipes(filteredRecipes);
}

function displayRecipes(recipes) {
  const container = document.getElementById("recipe-container");

  //clear container content
  container.innerHTML = "";

  recipes.forEach((recipe) => {
    // 1. Create parent div for each recipe
    const recipeDiv = document.createElement("div");
    recipeDiv.className = "recipe";

    // 2. Add recipe name (h2)
    const name = document.createElement("h2");
    name.textContent = recipe.name;
    recipeDiv.appendChild(name);

    // 3. Add image (img)
    const img = document.createElement("img");
    img.src = recipe.image;
    recipeDiv.appendChild(img);

    // 4. Add ingredients list (ul > li)
    const ingredientsList = document.createElement("ul");
    recipe.ingredients.forEach((ingredient) => {
      const li = document.createElement("li");
      li.textContent = ingredient;
      ingredientsList.appendChild(li);
    });
    recipeDiv.appendChild(ingredientsList);

    // 5. Add instructions list (ol > li)
    const instructionsList = document.createElement("ol");
    recipe.instructions.forEach((instructions) => {
      const li = document.createElement("li");
      li.textContent = instructions;
      instructionsList.appendChild(li);
    });
    recipeDiv.appendChild(instructionsList);

    //6. Add like button
    const likeButton = document.createElement("button");
    likeButton.type = "button";
    likeButton.className = `like-button ${recipe.liked ? "liked" : ""}`;
    likeButton.dataset.recipeId = recipe.id;
    likeButton.innerHTML = recipe.liked ? `💛 Liked` : `🤍 Like`;
    likeButton.addEventListener("click", (e) => {
      console.log("Like button clicked");
      e.stopImmediatePropagation();
      likeRecipe(recipe);
      return false;
    });
    recipeDiv.appendChild(likeButton);

    // 7. Append the recipe to the container
    container.appendChild(recipeDiv);
  });
}

function likeRecipe(recipe) {
  recipe.liked = !recipe.liked;

  const options = {
    method: "PATCH",
    headers: {
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "User-Agent": "EchoapiRuntime/1.1.0",
      Connection: "keep-alive",
    },
    body: JSON.stringify({
      liked: recipe.liked,
    }),
  };

  fetch(`http://localhost:3000/recipes/${recipe.id}`, options)
    .then((response) => response.json())
    .then((updatedRecipe) => {
      const likeButtons = document.querySelectorAll(".like-button");
      likeButtons.forEach((button) => {
        if (button.dataset.recipeId === recipe.id.toString()) {
          button.innerHTML = updatedRecipe.liked ? "💛 Liked" : "🤍 Like";
          button.classList.toggle("liked", updatedRecipe.liked);
        }
      });
    })
    .catch((err) => console.error(err));
}
