// Initialize express router
let router = require('express').Router();

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!'
    });
});

// Import player controller
var playerController = require('../controllers/playerController');
// Player routes
router.route('/players')
    .get(playerController.index)
    .post(playerController.new);

router.route('/players/:player_id')
    .get(playerController.view)
    .patch(playerController.update)
    .put(playerController.update)
    .delete(playerController.delete);


// Import team controller
var teamController = require('../controllers/teamController');
// Team routes
router.route('/teams')
    .get(teamController.index)
    .post(teamController.new);

router.route('/teams/:team_id')
    .get(teamController.view)
    .patch(teamController.update)
    .put(teamController.update)
    .delete(teamController.delete);


// Import team controller
var sessionController = require('../controllers/sessionController');
// Team routes
router.route('/sessions')
    .get(sessionController.index)
    .post(sessionController.new);

router.route('/sessions/:session_id')
    .get(sessionController.view)
    .patch(sessionController.update)
    .put(sessionController.update)
    .delete(sessionController.delete);


// Export API routes
module.exports = router;