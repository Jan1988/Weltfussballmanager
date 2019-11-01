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

// Team routes
router.route('/team')
    .get(playerController.index)
    .post(playerController.new);

router.route('/team/:player_id')
    .get(playerController.view)
    .patch(playerController.update)
    .put(playerController.update)
    .delete(playerController.delete);


// Export API routes
module.exports = router;