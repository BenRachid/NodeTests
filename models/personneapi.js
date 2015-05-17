module.exports = function (app, db, isLoggedIn) {
    app.get("/api/personnes", function (req, res) {
        var result = [];
        db.each("SELECT * FROM users ORDER BY login",
                function (err, row) {
                    result.push(row);
                },
                function () {
                    res.json(result);
                }
        );
    });

    app.get("/api/personne/:id", function (req, res) {
        var personne = undefined;
        db.each("SELECT * FROM users WHERE id = ?", [req.params.id],
                function (err, row) {
                    personne = row;
                },
                function () {
                    if (personne === undefined) {
                        res.status(404).end();
                    } else {
                        res.json(personne);
                    }
                }
        );
    });

    app.post("/api/personne", isLoggedIn, function (req, res) {
        var personne = req.body;
        if (personne.login === undefined) {
            res.status(400).end();
            return;
        }
        var stmt = db.prepare("INSERT INTO users(lastname,firstname,birhtdate,login,nickname) VALUES(?, ?, ?, ?, ?)");
        stmt.run(personne.lastname, personne.firstname, personne.birhtdate, personne.login, personne.nickname);
        stmt.finalize();
        res.status(200).end();
    });

    app.delete("/api/personne/:id", isLoggedIn, function (req, res) {
        var stmt = db.prepare("DELETE FROM users WHERE id=?");
        stmt.run(req.params.id);
        stmt.finalize();
        res.status(200).end();
    });

    app.put("/api/personne/:id", isLoggedIn, function (req, res) {
        var personne = req.body;
        if (personne.login === undefined) {
            res.status(400).end();
            return;
        }
        var stmt = db.prepare("UPDATE users SET lastname=?,firstname=?,birhtdate=?,nickname=? where id = ?");
        stmt.run(personne.lastname, personne.firstname,personne.birhtdate, personne.nickname, req.params.id);
        stmt.finalize();
        res.status(200).end();
    });
};

