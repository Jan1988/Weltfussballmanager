// playerController.js

// Import player model
Manager = require('../models/managerModel');

// Handle index actions
exports.index = function (req, res) {
    Manager.get(function (err, managers) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Managers retrieved successfully",
            data: managers
        });
    });
};

// Handle create player actions
exports.new = function (req, res) {
    var manager = new Manager();
    manager.name = req.body.name ? req.body.name : manager.name;
    manager.teamName = req.body.teamName;
    manager.bankBalance = req.body.bankBalance;

    manager.players = [];

    // save manager and check for errors
    manager.save(function (err) {
        // if (err)
        //     res.json(err);
        res.json({
            message: 'New manager created!',
            data: manager
        });
    });
};

// Handle view player info
exports.view = function (req, res) {
    Manager.findById(req.params.manager_id, function (err, manager) {
        if (err)
            res.send(err);
        res.json({
            message: 'Manager details loading..',
            data: manager
        });
    });
};

// Handle update player info
exports.update = function (req, res) {
    Manager.findById(req.params.manager_id, function (err, manager) {
        if (err)
            res.send(err);
        manager.name = req.body.name ? req.body.name : manager.name;
        manager.teamName = req.body.teamName;
        manager.bankBalance = req.body.bankBalance;
        manager.players = req.body.players;

        // save the player and check for errors
        manager.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Player Info updated',
                data: manager
            });
        });
    });
};

// Handle delete player
exports.delete = function (req, res) {
    Manager.remove({
        _id: req.params.manager_ids
    }, function (err, manager) {
        if (err)
            res.send(err);res.json({
            status: "success",
            message: 'Manager deleted'
        });
    });
};