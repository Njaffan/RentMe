var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Trainer = require('../models/trainer');
var passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
var mongoose = require ('mongoose')



//  register page
router.get('/register', function (req, res) {
    res.render('register');
});

// Login page
router.get('/login', function (req, res) {
    res.render('login');
    
});

//ServicePage
router.get('/service', function (req, res) {    
    res.render('service');
});

//  register User
router.post('/register', function (req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var confirm = req.body.confirm;

    // validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirm', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors

        })
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }



});

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {
                    message: 'Unknown User'
                });
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
            });
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});


router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    }),
    function (req, res) {
        res.redirect('/');
    });

router.get('/logout', function (req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});



//add service
router.post('/service',  function (req, res) {

    var name = req.body.name;
    var service = req.body.service;
    var price = req.body.price;
    var icon = req.body.icon;
   
    

    // validation
    //req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('service', 'Service is required').notEmpty();
    req.checkBody('price', 'Price is required').notEmpty();
    req.checkBody('price', 'Price is a number').isNumeric();
   

    var errors = req.validationErrors();

    if (errors) {
        res.render('service', {
            errors: errors

        })
    } else {
        var newTrainer = new Trainer({
            name: name,
            service: service,
            price: price
          
        });

        Trainer.createUser(newTrainer, function (err, trainer) {
            if (err) throw err;
            console.log(trainer);
           
        });

        req.flash('success_msg', 'Thank you, your services has been added');

        res.redirect('/');
    } 

});
module.exports = router;