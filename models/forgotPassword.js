const mongoose = require('mongoose');

const resetPasswordSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    }
})

const ResetPassword = mongoose.model("ResetPassword", resetPasswordSchema)

module.exports = ResetPassword;