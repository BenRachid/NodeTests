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