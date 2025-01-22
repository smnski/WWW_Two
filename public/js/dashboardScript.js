document.getElementById('addMealButton').addEventListener('click', async () => {
    try {
      const response = await fetch('/dashboard/recipes');
      const recipes = await response.json();
      const recipeList = document.getElementById('recipeList');
      recipeList.innerHTML = ''; // Clear previous entries

      recipes.forEach(recipe => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
          <span>${recipe.name} (Calories: ${recipe.calories})</span>
          <button class="btn btn-sm btn-primary add-recipe" data-id="${recipe._id}">Add</button>
        `;
        recipeList.appendChild(listItem);
      });

      document.querySelectorAll('.add-recipe').forEach(button => {
        button.addEventListener('click', async () => {
          const recipeId = button.getAttribute('data-id');
          try {
            const addResponse = await fetch('/dashboard/add-meal', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ recipeId })
            });

            if (addResponse.ok) {
              const meal = await addResponse.json();  // Assuming the backend returns the added meal details

              // Dynamically add the new meal to the meal list
              const mealCard = document.createElement('div');
              mealCard.classList.add('card', 'card-container', 'mb-3');
              mealCard.id = `meal-${meal._id}`;
              mealCard.innerHTML = `
                <div class="card-body">
                  <h5 class="card-title">${meal.name}</h5>
                  <p class="card-text">Calories: ${meal.calories}</p>
                  <p class="card-text">Protein: ${meal.protein}g</p>
                  <p class="card-text">Carbohydrates: ${meal.carbohydrates}g</p>
                  <p class="card-text">Fats: ${meal.fats}g</p>
                </div>
              `;
              document.querySelector('.button-container.flex-grow-1').appendChild(mealCard);

              // Hide the "No meals added" message if meals exist now
              const noMealsMessage = document.getElementById('noMealsMessage');
              if (noMealsMessage) {
                noMealsMessage.style.display = 'none';
              }

              // Close the modal correctly
              const modal = bootstrap.Modal.getInstance(document.getElementById('recipeModal'));
              modal.hide();
            } else {
              alert('Failed to add recipe.');
            }
          } catch (error) {
            console.error('Error:', error);
          }
        });
      });

      // Show the modal
      const modal = new bootstrap.Modal(document.getElementById('recipeModal'));
      modal.show();
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  });