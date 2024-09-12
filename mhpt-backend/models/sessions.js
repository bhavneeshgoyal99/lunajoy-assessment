const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true
    },
    authToken: {
        type: String,
        required: true
    },
    authTokenExpiryAt: {
        type: Number,
        required: true
    },
    refershTokenExpiryAt: {
        type: Number,
        required: true
    },
    loggedOut: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: true, updatedAt: true },
});

sessionSchema.statics.createSession = function (session) {
    return this.create(session);
};

sessionSchema.statics.getSession = function (condition, options = {}) {
    return this.findOne(condition, options);
};

sessionSchema.statics.updateSession = function (cond, update, options = {}) {
    return this.findOneAndUpdate(cond, update, options);
};

module.exports = mongoose.model('sessions', sessionSchema);
