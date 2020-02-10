
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Setup schema
var playerSchema = mongoose.Schema({
    name: {type: String, required: true},
    age: {type: Number, required: true},
    position: {    type: String,        required: true    },
    marketValue: {        type: Number,        required: true    },
    skill: {        type: Number,        required: true    },
    training: {        type: Number,        default: 100,    },
    experience: {        type: Number,        default: 100,    },
    team:{ type: Schema.Types.ObjectId, ref: 'Team' }
});
// var Player = mongoose.model('player', playerSchema);

// Export Contact model
var Player = module.exports = mongoose.model('Player', playerSchema);
module.exports.get = function (callback, limit) {
    Player.find(callback).limit(limit);
};
