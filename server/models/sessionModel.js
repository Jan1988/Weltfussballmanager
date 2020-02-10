
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Setup schema
var sessionSchema = mongoose.Schema({
    managerName: {type: String, required: true},
    bankBalance: {type: Number, required: true},
    team:{ type: Schema.Types.ObjectId, ref: 'Team' }
});

// Export Contact model
var Session = module.exports = mongoose.model('Session', sessionSchema);
module.exports.get = function (callback, limit) {
    Session.find(callback).limit(limit);
};
