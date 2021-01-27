const bodyParser = require('body-parser');
const session = require('express-session');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
const productsController = require('./controller/SignIn');
var adminRoutes = require('./routes/admin');
var regRoutes = require('./routes/registering');
var weatherRoutes = require('./routes/api');

var app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:"keyboard cat",
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.get('/', productsController.log);
app.use('/register', adminRoutes);
app.use('/api', weatherRoutes);
module.exports = app;
