var sqlite3 = require('sqlite3');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var passport = require('passport');
var session = require('express-session');
var exphbrs = require('express-handlebars');

var db = new sqlite3.Database('mabase.db');
var app = express();

app.use(cookieParser()); // read cookies (obligatoire pour l'authentification)
app.use(cookieSession({keys: ['exemplecourssecretkey']}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev')); // toute les requêtes HTTP dans le log du serveur

// passport authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// handlebars template engine
app.engine('.html', exphbrs({extname:'.html', defaultLayout: 'template'}));
app.set('view engine', '.html');

require('./passport.js')(passport);
require('./personneapi.js')(app, db);
require('./routes.js')(app, passport);
require('./personneroutes.js')(app, db);

app.listen(3333);
