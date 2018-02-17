var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

//init app
var app = express();

// view engine
app.set('views', path.join(__dirname, 'views')),
    app.engine('handlebars', exphbs({
        defaultLayout: 'layout'
    }));
app.set('view engine', 'handlebars');

// bodyParser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());


// setup public folder
app.use(express.static(path.join(__dirname, 'public')));

//Middleware for express session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}))



app.use(passport.initialize());
app.use(passport.session());

//middleware for the validator

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = parm.split('.'),
            root = namespace.shit(),
            formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';

        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}))

// connect Flash
app.use(flash());

//global var for flash session
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.err_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//middleware for routes
app.use('/', routes);
app.use('/users',users);


app.set('port',(process.env.PORT||3000));
app.listen(app.get('port'), function() {
    console.log("server started on port"+app.get('port'));
  });