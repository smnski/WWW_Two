function deleteRecipe(recipeId) {
  fetch(`/recipes/delete/${recipeId}`, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(data => {
    const recipeCard = document.getElementById(`recipe-${recipeId}`);
    if (recipeCard) {
      recipeCard.remove();
    }
  })
  .catch(error => {
    alert("Error deleting recipe");
  });
}
