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
              const meal = await addResponse.json(); // Assuming the backend returns the added meal details
      
              // Dynamically add the new meal to the correct container
              const mealCard = document.createElement('div');
              mealCard.classList.add('card', 'card-container', 'mb-3');
              mealCard.id = `meal-${meal._id}`;
              mealCard.innerHTML = `
                <div class="card-body">
                  <button class="btn btn-sm remove-meal" data-id="${meal._id}" style="position: absolute; top: 10px; right: 10px;">&times;</button>
                  <h5 class="card-title">${meal.name}</h5>
                  <p class="card-text">Calories: ${meal.calories}</p>
                  <p class="card-text">Protein: ${meal.protein}g</p>
                  <p class="card-text">Carbohydrates: ${meal.carbohydrates}g</p>
                  <p class="card-text">Fats: ${meal.fats}g</p>
                </div>
              `;
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
      
                    // If there are no meals left, show the "No meals added" message
                    const mealContainer = document.querySelector('.recipe-container');
                    if (mealContainer.children.length === 0) {
                      const noMealsMessage = document.getElementById('noMealsMessage');
                      if (noMealsMessage) {
                        noMealsMessage.style.display = 'block';
                      }
                    }
                  } else {
                    alert('Failed to remove meal.');
                  }
                } catch (error) {
                  console.error('Error removing meal:', error);
                }
              });
      
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
          // Remove the meal card from the DOM
          const mealCard = document.getElementById(`meal-${mealId}`);
          mealCard.remove();
  
          // If there are no meals left, show the "No meals added" message
          const mealContainer = document.querySelector('.recipe-container');
          if (mealContainer.children.length === 0) {
            const noMealsMessage = document.getElementById('noMealsMessage');
            if (noMealsMessage) {
              noMealsMessage.style.display = 'block';
            }
          }
        } else {
          alert('Failed to remove meal.');
        }
      } catch (error) {
        console.error('Error removing meal:', error);
      }
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    renderWeeklyGraph();
  });
  
  function renderWeeklyGraph() {
    // Define the week days in order.
    // Adjust these strings if you want different labels.
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Dummy data for the week.
    // In a real application, you might fetch this data from an API.
    // The keys must exactly match the day names in weekDays.
    // For example, suppose Monday to Thursday have calorie totals, and the rest of the week hasn't happened yet.
    const calorieData = {
      Monday: 1800,
      Tuesday: 2100,
      Wednesday: 1950,
      Thursday: 2200,
      // For days that haven't happened yet, leave them out or set as null/undefined:
      Friday: null,
      Saturday: null,
      Sunday: null
    };
  
    // Determine the maximum calorie total from days that have data.
    const maxCalories = Math.max(...weekDays.map(day => calorieData[day] || 0));
    
    // Use the graph container
    const graphContainer = document.getElementById('weeklyGraph');
    if (!graphContainer) return;
  
    // Clear the container just in case
    graphContainer.innerHTML = '';
  
    // Create a bar (rectangle) for each day.
    weekDays.forEach(day => {
      // Create a wrapper for bar + label
      const dayContainer = document.createElement('div');
      dayContainer.style.flex = '1';
      dayContainer.style.display = 'flex';
      dayContainer.style.flexDirection = 'column';
      dayContainer.style.alignItems = 'center';
      
      // Create the bar element
      const bar = document.createElement('div');
      bar.classList.add('bar');
  
      // Determine the calorie value for the day, or set to 0 if day hasn't happened.
      const calories = calorieData[day];
      
      // If day has calorie data, scale the height proportionally.
      // Otherwise, use a minimal height (e.g., 2px to indicate a line).
      const barHeight = calories
        ? (calories / maxCalories) * 100  // percent of container height
        : 2; // flat line for future day
  
      // Set the height (we assume the #weeklyGraph is set with a fixed height in CSS)
      bar.style.height = calories ? `${barHeight}%` : `${barHeight}px`;
  
      // Optionally, show the calorie number inside the bar if data is available.
      if (calories) {
        bar.textContent = calories;
        bar.style.color = '#fff';
        bar.style.fontSize = '0.8rem';
        bar.style.textAlign = 'center';
        bar.style.paddingBottom = '2px';
      }
  
      // Create a label for the day (below the bar)
      const label = document.createElement('div');
      label.classList.add('bar-label');
      label.textContent = day;
  
      // Append the bar and then the label to the day container
      dayContainer.appendChild(bar);
      dayContainer.appendChild(label);
  
      // Append to the main graph container
      graphContainer.appendChild(dayContainer);
    });
  }

  function renderWeeklyGraph(weekData) {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Use provided data or fallback dummy data
    const calorieData = weekData || {
      Monday: 1800,
      Tuesday: 2100,
      Wednesday: 1950,
      Thursday: 2200,
      Friday: null,
      Saturday: null,
      Sunday: null
    };
  
    const maxCalories = Math.max(...weekDays.map(day => calorieData[day] || 0));
    const graphContainer = document.getElementById('weeklyGraph');
    if (!graphContainer) return;
    graphContainer.innerHTML = '';
  
    weekDays.forEach(day => {
      const dayContainer = document.createElement('div');
      dayContainer.style.flex = '1';
      dayContainer.style.display = 'flex';
      dayContainer.style.flexDirection = 'column';
      dayContainer.style.alignItems = 'center';
      
      const bar = document.createElement('div');
      bar.classList.add('bar');
      const calories = calorieData[day];
      const barHeight = calories
        ? (calories / maxCalories) * 100
        : 2;
      bar.style.height = calories ? `${barHeight}%` : `${barHeight}px`;
  
      if (calories) {
        bar.textContent = calories;
        bar.style.color = '#fff';
        bar.style.fontSize = '0.8rem';
        bar.style.textAlign = 'center';
        bar.style.paddingBottom = '2px';
      }
  
      const label = document.createElement('div');
      label.classList.add('bar-label');
      label.textContent = day;
  
      dayContainer.appendChild(bar);
      dayContainer.appendChild(label);
  
      graphContainer.appendChild(dayContainer);
    });
  }