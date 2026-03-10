const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        role: {
            type: String,
            enum: ['FARMER', 'BUYER'],
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['bid', 'buy', 'message', 'order'],
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
