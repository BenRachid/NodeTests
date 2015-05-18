module.exports = function (app, db, isLoggedIn) {

    //Return First Level Messages
    app.get("/api/messages", function (req, res) {
        var result = [];
        db.each("SELECT * FROM messages where parent_message is null ORDER BY  lastUpdate, postdate",
                function (err, row) {
                    result.push(row);
                },
                function () {
                    res.json(result);
                }
        );
    });    
//Return Message
    app.get("/api/message/:id", function (req, res) {
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

    
//Return Comments
    app.get("/api/comments/:id", function (req, res) {
        var result = [];
        db.each("SELECT * FROM messages WHERE parent_message = ?", [req.params.id],
                function (err, row) {
                    result.push(row);
                },
                function () {
                    res.json(result);
                }
        );
    });
    app.post("/api/comment/:id", function (req, res, isLoggedIn) {
        var comment = req.body;
        if (comment.content === undefined || comment.topic === undefined) {
            res.status(400).end();
            return;
        }
        var stmt = db.prepare("INSERT INTO messages(content,topic, parent_message) VALUES(?, ?, ?)");
        stmt.run(comment.content, comment.topic, req.params.id);
        stmt.finalize();
        res.status(200).end();
    });
    app.post("/api/message", function (req, res, isLoggedIn) {
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

    app.delete("/api/message/:id", function (req, res, isLoggedIn) {
        var stmt = db.prepare("DELETE FROM messages WHERE id=?");
        stmt.run(req.params.id);
        stmt.finalize();
        res.status(200).end();
    });

    app.put("/api/message/:id", function (req, res, isLoggedIn) {
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
