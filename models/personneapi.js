module.exports = function (app, db, isLoggedIn) {
    app.get("/personnes", function (req, res) {
        var result = [];
        db.each("SELECT * FROM personne ORDER BY nom,prenom",
                function (err, row) {
                    result.push(row);
                },
                function () {
                    res.json(result);
                }
        );
    });

    app.get("/personne/:id", function (req, res) {
        var personne = undefined;
        db.each("SELECT * FROM personne WHERE id = ?", [req.params.id],
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

    app.post("/personne", isLoggedIn, function (req, res) {
        var personne = req.body;
        if (personne.nom === undefined || personne.prenom === undefined) {
            res.status(400).end();
            return;
        }
        var stmt = db.prepare("INSERT INTO personne(nom,prenom) VALUES(?, ?)");
        stmt.run(personne.nom, personne.prenom);
        stmt.finalize();
        res.status(200).end();
    });

    app.delete("/personne/:id", isLoggedIn, function (req, res) {
        var stmt = db.prepare("DELETE FROM personne WHERE id=?");
        stmt.run(req.params.id);
        stmt.finalize();
        res.status(200).end();
    });

    app.put("/personne/:id", isLoggedIn, function (req, res) {
        var personne = req.body;
        if (personne.nom === undefined || personne.prenom === undefined) {
            res.status(400).end();
            return;
        }
        var stmt = db.prepare("UPDATE personne SET nom=?,prenom=? WHERE id=?");
        stmt.run(personne.nom, personne.prenom, req.params.id);
        stmt.finalize();
        res.status(200).end();
    });
};

