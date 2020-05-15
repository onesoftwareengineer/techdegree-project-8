var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// middleware to catch 404 and render 404 page
app.use( (req,res) => {
  res.status(404);
  res.render('page-not-found', { title: "Page Not Found" } );
});

// error handler to catch errors and render error page (404 excluded)
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //console log details about the error
  res.status(err.status || 500);
  console.log(res.locals.message);
  res.render('error', { title: 'Server Error' });
});

module.exports = app;