var express = require('express');
var router = express.Router();
const { Book, Sequelize } = require('../models/index');
//initialize to use Sequelize operators
const Op = Sequelize.Op;

//asyncHandler used to avoid adding try catch for each promise while calling database
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
  //req.query.page is parameter used for pagination
  //if there is no page parameter then initialize it with 1
  let currentPageNumber = req.query.page;
  if(currentPageNumber === undefined) {
    currentPageNumber = 0;
  }
  
  //get number of pages
  const numberOfPages = Math.ceil((await Book.findAll()).length / 10);

  //get books for required page
  const allBooks = await Book.findAll({
    offset: currentPageNumber*10,
    limit: (currentPageNumber+1)*10,
  });
  res.render('index', { allBooks, numberOfPages });
}));

/* post /books - searches for title, author, genre and year */
router.post('/', asyncHandler( async(req,res) => {
  const allBooks = await Book.findAll({
    where: {
      [Op.or]: [
        {title: {
          [Op.like]: `%${req.body.search}%`
        }},
        {author: {
            [Op.like]: `%${req.body.search}%`
        }},
        {year: {
            [Op.like]: `%${req.body.search}%`
        }},
        {genre: {
            [Op.like]: `%${req.body.search}%`
        }}
      ]
    },
    //books will be displayed in ascending order by title, books starting with letter A first and so on ...
    order: [['title','ASC']],
  });
  res.render('index', {allBooks, query: req.body.search, numberOfPages: 0});
}));

/* get /books/new - Shows the create new book form. */
router.get('/new', (req,res) => {
  res.render('new-book', {book: {}, title: "New Book"});
});

/* post /books/new - Posts a new book to the database. */
router.post('/new', asyncHandler( async(req,res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect('/books/');
    } catch (error) {
      //handle sequelize validation error
      if(error.name === 'SequelizeValidationError') {
        book = await Book.build(req.body);
        res.render('new-book', { book , errors: error.errors, title: "New Book" });
      } else {
        throw error;
      }
    } 
  }
));

/* get /books/:id - Shows book detail form. */
router.get('/:id', asyncHandler( async(req,res,next) => {
    const book = await Book.findByPk(req.params.id);
    res.render('update-book', {book:book, title:"Update Book"});
  }
));

/* post /books/:id - Updates book info in the database. */
router.post('/:id', asyncHandler( async (req,res) => {
  let book = await Book.findByPk(req.params.id);
  try {
    await book.update(req.body)
    res.redirect('/books');      
  } catch (error) {
    //handle sequelize validation errors
    if(error.name === 'SequelizeValidationError') {
      book = req.body;
      book.id = req.params.id;
      res.render('update-book', {book, errors: error.errors, title:"Update Book"});
    } else {
      throw(error);
    }
  }
}));

/* post /books/:id/delete - Deletes a book. Careful, this can’t be undone ;) */
router.post('/:id/delete', asyncHandler( async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  book.destroy();
  res.redirect('/books');
}));

module.exports = router;