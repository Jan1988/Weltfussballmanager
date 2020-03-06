
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var managerSchema = mongoose.Schema({
    name: {type: String, required: true},
    teamName: {type: String, required: true},
    bankBalance: {type: Number, required: true},
    players : [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    starters : [{ type: Schema.Types.ObjectId, ref: 'Player' }]
});

var Manager = module.exports = mongoose.model('Manager', managerSchema);
module.exports.get = function (callback, limit) {
    Manager.find(callback).limit(limit);
};