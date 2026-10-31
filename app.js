var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

require('dotenv').config();
var session = require('express-session');

var fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/admin/login');
var homeRouter = require('./routes/admin/home');
var localesRouter = require('./routes/admin/locales');
var categoriasMenuRouter = require('./routes/admin/categoriasMenu');
var itemsMenuRouter = require('./routes/admin/itemsMenu');
var hospedajesRouter = require('./routes/admin/hospedajes');
var habitacionesRouter = require('./routes/admin/habitacionesHospedaje');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var hbs = require('hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'CEA2025qxwzpld',
  cookie: { maxAge: null },
  resave: false,
  saveUninitialized: true
}));

// middleware para proteger rutas del admin
secured = async (req, res, next) => {
  try {
    if (req.session.id_usuario) {
      next();
    } else {
      res.redirect('/admin/login');
    }
  } catch (error) {
    console.log(error);
  }
};

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.use('/', indexRouter);
app.use('/admin/login', loginRouter);
app.use('/admin/home', secured, homeRouter);
app.use('/admin/locales', secured, localesRouter);
app.use('/admin/locales/:localId/menu', secured, categoriasMenuRouter);
app.use('/admin/locales/:localId/menu/:categoriaId/items', secured, itemsMenuRouter);
app.use('/admin/hospedajes', secured, hospedajesRouter);
app.use('/admin/hospedajes/:hospedajeId/habitaciones', secured, habitacionesRouter);
app.use('/api', cors(), apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;