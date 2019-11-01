// playerModel.js
var mongoose = require('mongoose');

// Setup schema
var playerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    marketValue: {
        type: Number,
        required: true
    },
    skill: {
        type: Number,
        required: true
    },
    training: {
        type: Number,
        default: 100,
    },
    experience: {
        type: Number,
        default: 100,
    },
    isSold:{
        type: Boolean,
        default: false
    }
    // create_date: {
    //     type: Date,
    //     default: Date.now
    // }
});

// Export Contact model
var Player = module.exports = mongoose.model('player', playerSchema);
module.exports.get = function (callback, limit) {
    Player.find(callback).limit(limit);
};