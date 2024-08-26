require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this line to handle JSON bodies
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use(methodOverride('_method')); // Add this line for method overriding

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());

// View engine setup
app.set('views', path.join(__dirname, 'views')); // Ensure views directory is set
app.set('layout', './layouts/main'); // Ensure layout path is correct
app.set('view engine', 'ejs');

// Routes setup
const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => console.log(`Listening to port ${port}`));
require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this line to handle JSON bodies
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use(methodOverride('_method')); // Add this line for method overriding

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());

// View engine setup
app.set('views', path.join(__dirname, 'views')); // Ensure views directory is set
app.set('layout', './layouts/main'); // Ensure layout path is correct
app.set('view engine', 'ejs');

// Routes setup
const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => console.log(`Listening to port ${port}`));
