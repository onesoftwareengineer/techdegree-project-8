var express = require('express');
var router = express.Router();
const { Book } = require('../models/index');

//asyncHandler used to avoid adding try catch for each promise while calling database
//code taken from https://teamtreehouse.com/library/refactor-with-express-middleware
function asyncHandler(cb){
  return async (req, res, next)=>{
    try {
      await cb(req,res, next);
    } catch(err){
      next(err);
    }
  };
}

/* get /books - Shows the full list of books */
router.get('/', asyncHandler( async (req,res) => {
    const allBooks = await Book.findAll({
      //books will be displayed in ascending order by title, books starting with a first and so on
      order: [['title','ASC']],
    });
    res.render('index', { allBooks });
  }
));

/* get /books/new - Shows the create new book form. */
router.get('/new', (req,res) => {
  res.render('new-book', {book: {}, title: "New Book"});
});

/* post /books/new - Posts a new book to the database. */

/* get /books/:id - Shows book detail form. */

/* post /books/:id - Updates book info in the database. */

/* post /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting. */

/* Set up a custom error handler middleware function that logs the error to the console and renders an “Error” view with a friendly message for the user. This is useful if the server encounters an error, like trying to view the “Books Detail” page for a book :id that doesn’t exist. See the error.html file in the example-markup folder to see what this would look like. */

/* Set up a middleware function that returns a 404 NOT FOUND HTTP status code and renders a "Page Not Found" view when the user navigates to a non-existent route, such as /error. See the page_found.html file in the example markup folder for an example of what this would look like. */

module.exports = router;