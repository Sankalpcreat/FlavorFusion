// Add Ingredients dynamically
let addIngredientsBtn = document.getElementById('addIngredientsBtn');
let ingredientList = document.querySelector('.ingredientList');
let ingredientDiv = document.querySelectorAll('.ingredientDiv')[0];

addIngredientsBtn.addEventListener('click', function() {
  let newIngredients = ingredientDiv.cloneNode(true);
  let input = newIngredients.getElementsByTagName('input')[0];
  input.value = '';
  ingredientList.appendChild(newIngredients);
});

// Handle AJAX Deletion
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.deleteBtn').forEach(button => {
    button.addEventListener('click', async (event) => {
      const recipeId = event.target.dataset.id; // Get recipe ID from data attribute
      const confirmed = confirm('Are you sure you want to delete this recipe?');

      if (confirmed) {
        try {
          const response = await fetch(`/recipe/${recipeId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const result = await response.json();

          if (response.ok) {
            alert(result.message);
            // Optionally, remove the deleted recipe from the DOM
            document.querySelector(`#recipe-${recipeId}`).remove();
          } else {
            alert('Error: ' + result.message);
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while deleting the recipe.');
        }
      }
    });
  });
});
