const mongoose = require('mongoose');

const { Schema } = mongoose;

const blacklistTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // 24 hours in seconds
    },
});

module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);