const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

/**
 * App Routes 
*/
router.get('/', recipeController.homepage);
router.get('/recipe/:id', recipeController.exploreRecipe );
router.get('/categories', recipeController.exploreCategories);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipeOnPost);
router.delete('/delete-recipe/:id', recipeController.deleteRecipe);
router.get('/about', recipeController.aboutPage);
router.get('/contact', recipeController.contactPage);  // Add this line

router.post('/submit-contact', recipeController.submitContact);
// Route to show the update form
router.get('/update-recipe/:id', recipeController.showUpdateForm);

// Route to handle the form submission for updating a recipe
router.post('/update-recipe/:id', recipeController.updateRecipeOnPost);

router.post('/voiceflow-interact', recipeController.voiceflowInteract);

 
module.exports = router;