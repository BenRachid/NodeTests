module.exports = function (app, passport, isLoggedIn) {

    var public = __dirname + '/public_html/';
    var css = public + '/css/';
    var js = public + '/js/';
    var media = public + '/media/';
    app.get(['/'], function (req, res) {
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


    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect: '/welcome',
                failureRedirect: '/index',
            }));

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('*.css', function (req, res) {
        res.sendFile(css + req.originalUrl);
    });
    app.get('*.png', function (req, res) {
        res.sendFile(media + req.originalUrl);
    });
    app.get('*.js', function (req, res) {
        res.sendFile(js + req.originalUrl);
    });
    app.get('/account', isLoggedIn, function(req, res){
      res.render('account', { user: req.user });
    });
};

function viewname(req) {
    return req.originalUrl.replace(/^\//, '');
}
;

