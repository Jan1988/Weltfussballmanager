// playerController.js

// Import player model
Player = require('../models/playerModel');

// Handle index actions
exports.index = function (req, res) {
    Player.get(function (err, players) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Players retrieved successfully",
            data: players
        });
    });
};

// Handle create player actions
exports.new = function (req, res) {
    var player = new Player();
    player.name = req.body.name ? req.body.name : player.name;
    player.age = req.body.age;
    player.position = req.body.position;
    player.marketValue = req.body.marketValue;
    player.skill = req.body.skill;
    player.experience = req.body.experience ? req.body.experience : player.experience;
    player.training = req.body.training ? req.body.training : player.training;
    player.team = req.body.team;
    // player.isSold = req.body.isSold ? req.body.isSold : player.isSold;

    // save the player and check for errors
    player.save(function (err) {
        // if (err)
        //     res.json(err);
        res.json({
            message: 'New player created!',
            data: player
        });
    });
};

// Handle view player info
exports.view = function (req, res) {
    Player.findById(req.params.player_id, function (err, player) {
        if (err)
            res.send(err);
        res.json({
            message: 'Player details loading..',
            data: player
        });
    });
};

// Handle update player info
exports.update = function (req, res) {
    Player.findById(req.params.player_id, function (err, player) {
        if (err)
            res.send(err);
            player.name = req.body.name ? req.body.name : player.name;
            player.age = req.body.age;
            player.position = req.body.position;
            player.marketValue = req.body.marketValue;
            player.skill = req.body.skill;
            player.experience = req.body.experience;
            player.training = req.body.training;

        // save the player and check for errors
        player.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Player Info updated',
                data: player
            });
        });
    });
};

// Handle delete player
exports.delete = function (req, res) {
    Player.remove({
        _id: req.params.player_ids
    }, function (err, player) {
        if (err)
            res.send(err);res.json({
            status: "success",
            message: 'Player deleted'
        });
    });
};