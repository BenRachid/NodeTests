module.exports = function (app, db, isLoggedIn) {
    app.get("/messages", function (req, res) {
        var result = [];
        db.each("SELECT * FROM messages ORDER BY  lastUpdate, postdate",
                function (err, row) {
                    result.push(row);
                },
                function () {
                    res.json(result);
                }
        );
    });

    app.get("/message/:id", function (req, res) {
        var message = undefined;
        db.each("SELECT * FROM messages WHERE id = ?", [req.params.id],
                function (err, row) {
                    message = row;
                },
                function () {
                    if (message === undefined) {
                        res.status(404).end();
                    } else {
                        res.json(message);
                    }
                }
        );
    });

    app.post("/message", function (req, res, isLoggedIn) {
        var message = req.body;
        if (message.content === undefined || message.topic === undefined) {
            res.status(400).end();
            return;
        }
        var stmt = db.prepare("INSERT INTO messages(content,topic) VALUES(?, ?)");
        stmt.run(message.content, message.topic);
        stmt.finalize();
        res.status(200).end();
    });

    app.delete("/message/:id", function (req, res, isLoggedIn) {
        var stmt = db.prepare("DELETE FROM messages WHERE id=?");
        stmt.run(req.params.id);
        stmt.finalize();
        res.status(200).end();
    });

    app.put("/message/:id", function (req, res, isLoggedIn) {
        var message = req.body;
        if (message.topic === undefined || message.content === undefined) {
            res.status(400).end();
            return;
        }
        var stmt = db.prepare("UPDATE messages SET topic=?,content=?, lastupdate=(datetime('now','localtime')) WHERE id=?");
        stmt.run(message.topic, message.content, req.params.id);
        stmt.finalize();
        res.status(200).end();
    });
};
