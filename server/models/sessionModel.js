
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Setup schema
var sessionSchema = mongoose.Schema({
    name: {type: String, required: true},
    manager:{ type: Schema.Types.ObjectId, ref: 'Manager' },
    lastSave:{type: Date, required: true}
});

// Export Contact model
var Session = module.exports = mongoose.model('Session', sessionSchema);
module.exports.get = function (callback, limit) {
    Session.find(callback).limit(limit);
};
