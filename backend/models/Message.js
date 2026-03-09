const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crop',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        maxlength: 2000
    }
}, { timestamps: true });

messageSchema.index({ listingId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
