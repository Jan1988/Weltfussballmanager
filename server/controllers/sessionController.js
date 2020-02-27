// playerController.js

// Import player model
Session = require('../models/sessionModel');

// Handle index actions
exports.index = function (req, res) {
    Session.get(function (err, sessions) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Sessions retrieved successfully",
            data: sessions
        });
    });
};

// Handle create player actions
exports.new = function (req, res) {
    var session = new Session();
    session.name = req.body.name ? req.body.name : session.name;
    session.manager = req.body.manager;
    session.lastSave = req.body.lastSave ? req.body.lastSave : session.lastSave;

    // save team and check for errors
    session.save(function (err) {
        // if (err)
        //     res.json(err);
        res.json({
            message: 'New session created!',
            data: session
        });
    });
};

// Handle view player info
exports.view = function (req, res) {
    Session.findById(req.params.session_id, function (err, session) {
        if (err)
            res.send(err);
        res.json({
            message: 'Session details loading..',
            data: session
        });
    });
};

// Handle update player info
exports.update = function (req, res) {
    Session.findById(req.params.session_id, function (err, session) {
        if (err)
            res.send(err);
        session.name = req.body.name ? req.body.name : session.name;
        session.manager = req.body.manager;
        session.lastSave = req.body.lastSave ? req.body.lastSave : session.lastSave;

        // save the player and check for errors
        session.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Session Info updated',
                data: session
            });
        });
    });
};

// Handle delete player
exports.delete = function (req, res) {
    Session.remove({
        _id: req.params.session_ids
    }, function (err, session) {
        if (err)
            res.send(err);res.json({
            status: "success",
            message: 'Session deleted'
        });
    });
};