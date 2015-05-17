var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var configAuth = require('./auth.js');

module.exports = function (passport) {

    var utilisateur = function (login) {
        this.identifiant = login;
    };

    // objet utilisateur -> identifiant de session
    passport.serializeUser(function (user, done) {
        done(null, user.identifiant);
    });

    // identifiant de session -> objet utilisateur
    passport.deserializeUser(function (login, done) {
        done(null, new utilisateur(login));
    });

    // =========================================================================
    // LOCAL =================================================================
    // =========================================================================    
    passport.use('local-login', new LocalStrategy({
        // champs du formulaire login
        usernameField: 'login',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, login, password, done) {
        if (login[0] === 'z') {
            return done(null, new utilisateur(login));
        }
        return done(null, false);
    }));

    // =========================================================================
    // TWITTER =================================================================
    // ========================================================================= 
    passport.use(new TwitterStrategy({
        consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL: configAuth.twitterAuth.callbackURL

    },
    function (token, tokenSecret, profile, done) {
        process.nextTick(function () {
            console.log("twitter auth: " + profile.username);
            return done(null, new utilisateur(profile.username));
        });

    }));
};