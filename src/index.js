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
        displayRecipes(data);
  })
  .catch((err) => console.error(err));

function displayRecipes(recipes) {
  const container = document.getElementById("recipe-container");

  //clear container content
  container.innerHTML = "";

  recipes.forEach((recipe) => {
    //for each recipe create a new div element
    const recipeElement = document.createElement("div");
    recipeElement.classList.add("recipe");

    //create elements for recipe name, image, ingredients and instructions
    const title = document.createElement("h2");
    title.textContent = recipe.name;

    const image = document.createElement("img");
    image.src = recipe.image;
    image.alt = recipe.name;

    const ingredientsList = document.createElement("ul");
    recipe.ingredients.forEach((ingredient) => {
      const li = document.createElement("li");
      li.textContent = ingredient;
      ingredientsList.appendChild(li);
    });

    //Append elements to the recipe element
    recipeElement.appendChild(title);
    recipeElement.appendChild(image);
    recipeElement.appendChild(ingredientsList);

    //Add instructions as a list
    const instructionList = document.createElement("ol");
    recipe.instructions.forEach((step) => {
      const li = document.createElement("li");
      li.textContent = step;
      instructionList.appendChild(li);
    });
    recipeElement.appendChild(instructionList);

    //Append the recipe element to the container
    container.appendChild(recipeElement);
  });
}
