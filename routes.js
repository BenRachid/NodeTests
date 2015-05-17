module.exports = function (app, passport) {

    var public = __dirname + '/public_html/';
    var css = public + '/css/';
    var js = public + '/js/';

    app.get(['/', '/login'], function (req, res) {
        if (req.originalUrl === '/') {
            req.originalUrl = 'index';
        }
        var model = {user: req.user};
        res.render(viewname(req), model);
    });

    app.get(['/welcome'], isLoggedIn, function (req, res) {
        var model = {user: req.user};
        res.render(viewname(req), model);
    });

    app.post('/authenticate', passport.authenticate('local-login', {
        successRedirect: '/welcome',
        failureRedirect: '/login'
    }));

    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect: '/welcome',
                failureRedirect: '/login'
            }));

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('*.css', function (req, res) {
        res.sendFile(css + req.originalUrl);
    });

    app.get('*.js', function (req, res) {
        res.sendFile(js + req.originalUrl);
    });

};

function viewname(req) {
    return req.originalUrl.replace(/^\//, '');
}
;

function isLoggedIn(req, res, next) {
    // si utilisateur authentifié, continuer
    if (req.isAuthenticated()) {
        return next();
    }
    // sinon afficher formulaire de login
    res.redirect('/login');
}