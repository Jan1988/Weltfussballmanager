// contactModel.js
var mongoose = require('mongoose');

// Setup schema
var contactSchema = mongoose.Schema({
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
    // create_date: {
    //     type: Date,
    //     default: Date.now
    // }
});

// Export Contact model
var Contact = module.exports = mongoose.model('contact', contactSchema);
module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
};