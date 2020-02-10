
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = mongoose.Schema({
    name: {type: String, required: true},
    players : [{ type: Schema.Types.ObjectId, ref: 'Player' }]
});

var Team = module.exports = mongoose.model('Team', teamSchema);
module.exports.get = function (callback, limit) {
    Team.find(callback).limit(limit);
};