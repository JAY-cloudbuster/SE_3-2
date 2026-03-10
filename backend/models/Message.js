const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crop',
        required: true
    },
    fromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toId: {
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

// Backward-compatible aliases used by existing UI code paths.
messageSchema.virtual('senderId').get(function getSenderId() {
    return this.fromId;
});

messageSchema.virtual('receiverId').get(function getReceiverId() {
    return this.toId;
});

messageSchema.set('toJSON', { virtuals: true });
messageSchema.set('toObject', { virtuals: true });

messageSchema.index({ listingId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
