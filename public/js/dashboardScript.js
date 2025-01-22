document.getElementById('addMealButton').addEventListener('click', async () => {
  try {
    const response = await fetch('/dashboard/recipes');
    const recipes = await response.json();
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = ''; // Clear previous entries

    recipes.forEach(recipe => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
      listItem.innerHTML = 
        `<span>${recipe.name} (Calories: ${recipe.calories})</span>
        <button class="btn btn-sm btn-primary add-recipe" data-id="${recipe._id}">Add</button>`;
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
            const meal = await addResponse.json(); // Assuming the backend returns the added meal details

            // Dynamically add the new meal to the correct container
            const mealCard = document.createElement('div');
            mealCard.classList.add('card', 'card-container', 'mb-3');
            mealCard.id = `meal-${meal._id}`;
            mealCard.innerHTML = 
              `<div class="card-body">
                <button class="btn btn-sm remove-meal" data-id="${meal._id}" style="position: absolute; top: 10px; right: 10px;">&times;</button>
                <h5 class="card-title">${meal.name}</h5>
                <p class="card-text">Calories: ${meal.calories}</p>
                <p class="card-text">Protein: ${meal.protein}g</p>
                <p class="card-text">Carbohydrates: ${meal.carbohydrates}g</p>
                <p class="card-text">Fats: ${meal.fats}g</p>
              </div>`;
            document.querySelector('.recipe-container').appendChild(mealCard);

            // Attach the remove button functionality to the newly added card
            const removeButton = mealCard.querySelector('.remove-meal');
            removeButton.addEventListener('click', async () => {
              try {
                const response = await fetch('/dashboard/remove-meal', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ mealId: meal._id })
                });

                if (response.ok) {
                  // Remove the meal card from the DOM
                  mealCard.remove();

                  // Recalculate the total calories
                  recalculateTotalCalories();
                } else {
                  alert('Failed to remove meal.');
                }
              } catch (error) {
                console.error('Error removing meal:', error);
              }
            });

            // Recalculate total calories
            recalculateTotalCalories();

            // Close the modal correctly
            const modal = bootstrap.Modal.getInstance(document.getElementById('recipeModal'));
            modal.hide();

            // Reload the page to reflect the changes
            location.reload();
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

// Recalculate the total calories based on current meal data
function recalculateTotalCalories() {
  const mealCards = document.querySelectorAll('.card-container');
  let totalCalories = 0;

  mealCards.forEach(card => {
    const caloriesElement = card.querySelector('.card-text'); // Assuming calories text is within .card-text
    if (caloriesElement) {
      const calories = parseInt(caloriesElement.textContent.match(/\d+/)[0], 10); // Extracting the number
      totalCalories += calories;
    }
  });

  // Update the total calories display on the dashboard
  const calorieSummary = document.querySelector('.summary-text');
  if (calorieSummary) {
    calorieSummary.innerHTML = `<strong>Consumed:</strong> ${totalCalories} kcal`;
  }
}

document.querySelectorAll('.remove-meal').forEach(button => {
  button.addEventListener('click', async (event) => {
    const mealId = event.target.getAttribute('data-id');
    try {
      const response = await fetch('/dashboard/remove-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealId })
      });

      if (response.ok) {
        // Reload the page to reflect the changes
        location.reload();
      } else {
        alert('Failed to remove meal.');
      }
    } catch (error) {
      console.error('Error removing meal:', error);
    }
  });
});

// Call recalculateTotalCalories on page load
document.addEventListener('DOMContentLoaded', () => {
  recalculateTotalCalories();
});
