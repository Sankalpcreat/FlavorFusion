require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const Contact = require('../models/Contact');
const VOICEFLOW_API_KEY = 'VF.DM.66af38c157fab51f90938584.u2VWcgZPyrMmu0Tm'; // Replace with your actual API key
const VOICEFLOW_PROJECT_ID = '66af2a12c4ae7f489b234893'; // Replace with your actual project ID

/**
 * GET /
 * Homepage 
*/
exports.homepage = async(req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
    const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
    const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);

    const food = { latest, thai, american, chinese };

    res.render('index', { title: 'Cooking Blog - Home', categories, food } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'Cooking Blog - Categories', categories } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /categories/:id
 * Categories By Id
*/
exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 
 
/**
 * GET /recipe/:id
 * Recipe 
*/
exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render('recipe', { title: 'Cooking Blog - Recipe', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * POST /search
 * Search 
*/
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Cooking Blog - Search', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
  
}

/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 



/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Cooking Blog - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}
exports.deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    if (!recipeId) {
      return res.status(400).json({ message: 'Recipe ID is missing' });
    }
    const result = await Recipe.findByIdAndDelete(recipeId);
    if (!result) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error.message);
    res.status(500).json({ message: error.message || 'Error Occurred' });
  }
};
exports.aboutPage = (req, res) => {
  res.render('about');
};
exports.contactPage = (req, res) => {
  const infoSubmit = req.flash('infoSubmit') || '';
  res.render('contact', { title: 'Contact Us - FlavorFusion', infoSubmit });
};
exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      message
    });

    await newContact.save();

    req.flash('infoSubmit', 'Your message has been sent successfully.');
    res.redirect('/contact');
  } catch (error) {
    req.flash('infoErrors', 'There was an error sending your message.');
    res.redirect('/contact');
  }
};

// Show the update form
// In your recipeController.js
exports.showUpdateForm = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }
    
    // Variables to be passed to the view
    const infoSubmitObj = req.flash('infoSubmitObj') || '';
    const infoErrorsObj = req.flash('infoErrorsObj') || '';

    res.render('update-recipe', {
      recipe,
      infoSubmitObj,
      infoErrorsObj
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};


// Handle the form submission for updating a recipe
exports.updateRecipeOnPost = async (req, res) => {
  try {
    const recipeId = req.params.id;

    // Initialize updateData with fields from req.body
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category
    };

    // Handle ingredients
    let ingredients = req.body.ingredients;
    if (Array.isArray(ingredients)) {
      updateData.ingredients = ingredients;
    } else if (typeof ingredients === 'string') {
      // Handle if ingredients are sent as a string separated by new lines
      updateData.ingredients = ingredients.split('\n').map(ingredient => ingredient.trim());
    }

    // Handle image upload
    if (req.files && req.files.image) {
      const imageUploadFile = req.files.image;
      const newImageName = Date.now() + imageUploadFile.name;
      const uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
      updateData.image = newImageName;
    }

    // Update the recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, updateData, { new: true });

    // Redirect to the updated recipe page
    res.redirect(`/recipe/${updatedRecipe._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};
exports.voiceflowInteract = async (req, res) => {
  try {
    const { userInput } = req.body; // Get user input from the request body

    const response = await axios.post(`https://general-runtime.voiceflow.com/state/${VOICEFLOW_PROJECT_ID}/user/${req.sessionID}/interact`, {
      request: {
        type: 'text',
        payload: userInput,
      }
    }, {
      headers: {
        Authorization: `Bearer ${VOICEFLOW_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data); // Send the response back to the client
  } catch (error) {
    console.error('Error interacting with Voiceflow API:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
};





// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();


/**
 * Dummy Data Example 
*/

// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       }, 
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       }, 
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();


// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();

