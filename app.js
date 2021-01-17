const path = require('path');
var logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const errorController = require('./controller/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const regRoutes = require('./routes/registering');
const weatherRoutes = require('./routes/api');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:"mysecretsession",
    resave: false, // Force save of session for each request
    saveUninitialized: false, // Save a session that is new, but has not been modified
    cookie: {maxAge: 10*60*1000 }, // milliseconds!
    alreadyExist:false,
    }));
app.use('/register', adminRoutes);
app.use('/registering', regRoutes);
app.use('/api', weatherRoutes);
//app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);
