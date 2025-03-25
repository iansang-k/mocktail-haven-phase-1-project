document.addEventListener("DOMContentLoaded", function () {
  fetchRecipes();
});
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
    recipeElement.className = "recipe";
    recipeElement.innerHTML = `
        <h3>${recipe.name}</h3>
        <img src="${recipe.image}" alt="${recipe.name}" />
        <h4>Ingredients:</h4>
        <ul>${recipe.ingredients.map((ing) => `<li>${ing}</li>`).join("")}</ul>
      <h4>Instructions:</h4>
      <ol>${recipe.instructions
        .map((step) => `<li>${step}</li>`)
            .join("")}</ol>`;
      container.appendChild(recipeElement);
  });
}
