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
    session.managerName = req.body.managerName ? req.body.managerName : session.managerName;
    session.bankBalance = req.body.bankBalance;
    session.team = req.body.team;

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
        session.managerName = req.body.name ? req.body.name : team.name;
        session.bankBalance = req.body.bankBalance;
        session.team = req.body.players;

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