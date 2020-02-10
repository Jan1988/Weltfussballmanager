// playerController.js

// Import player model
Team = require('../models/teamModel');

// Handle index actions
exports.index = function (req, res) {
    Team.get(function (err, teams) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Teams retrieved successfully",
            data: teams
        });
    });
};

// Handle create player actions
exports.new = function (req, res) {
    var team = new Team();
    team.name = req.body.name ? req.body.name : team.name;
    team.players = req.body.players;

    // save team and check for errors
    team.save(function (err) {
        // if (err)
        //     res.json(err);
        res.json({
            message: 'New team created!',
            data: team
        });
    });
};

// Handle view player info
exports.view = function (req, res) {
    Team.findById(req.params.team_id, function (err, team) {
        if (err)
            res.send(err);
        res.json({
            message: 'Team details loading..',
            data: team
        });
    });
};

// Handle update player info
exports.update = function (req, res) {
    Team.findById(req.params.team_id, function (err, team) {
        if (err)
            res.send(err);
        team.name = req.body.name ? req.body.name : team.name;
        team.players = req.body.players;

        // save the player and check for errors
        team.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Player Info updated',
                data: team
            });
        });
    });
};

// Handle delete player
exports.delete = function (req, res) {
    Team.remove({
        _id: req.params.team_ids
    }, function (err, team) {
        if (err)
            res.send(err);res.json({
            status: "success",
            message: 'Team deleted'
        });
    });
};