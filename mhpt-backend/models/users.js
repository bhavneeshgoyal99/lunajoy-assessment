const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    profileImage: {
        type: String
    },
    clientId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    submittedToday: {
        type: Boolean,
        default: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: true, updatedAt: true },
});

usersSchema.statics.createUser = function (user) {
    return this.create(user);
};

usersSchema.statics.getUser = function (condition, options = {}) {
    return this.findOne(condition, options);
};

usersSchema.statics.getUsers = function (condition, options = {}) {
    return this.find(condition, options);
};

usersSchema.statics.updateUser = function (cond, update, options = {}) {
    return this.findOneAndUpdate(cond, update, options);
};

module.exports = mongoose.model('users', usersSchema);
