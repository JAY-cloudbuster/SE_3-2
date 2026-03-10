const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const { createNotification } = require('../utils/notificationEmitter');

const sendMessage = asyncHandler(async (req, res) => {
    const { listingId, fromId, toId, text } = req.body;

    if (!listingId || !fromId || !toId || !String(text || '').trim()) {
        res.status(400);
        throw new Error('listingId, fromId, toId, and text are required');
    }

    if (String(req.user.id) !== String(fromId)) {
        res.status(403);
        throw new Error('You can only send messages as yourself');
    }

    const message = await Message.create({
        listingId,
        fromId,
        toId,
        text: String(text).trim(),
    });

    await createNotification({
        userId: toId,
        role: req.user.role === 'BUYER' ? 'FARMER' : 'BUYER',
        title: 'New Message',
        message: `${req.user.name || 'A user'} sent you a message.`,
        type: 'message',
    });

    const populated = await Message.findById(message._id)
        .populate('fromId', 'name phone')
        .populate('toId', 'name phone');

    res.status(201).json(populated);
});

const getConversation = asyncHandler(async (req, res) => {
    const { listingId, user1, user2 } = req.query;

    if (!listingId) {
        res.status(400);
        throw new Error('listingId query parameter is required');
    }

    const filter = { listingId };
    if (user1 && user2) {
        filter.$or = [
            { fromId: user1, toId: user2 },
            { fromId: user2, toId: user1 },
        ];
    }

    const messages = await Message.find(filter)
        .populate('fromId', 'name phone')
        .populate('toId', 'name phone')
        .sort({ createdAt: 1 });

    res.status(200).json(messages);
});

module.exports = {
    sendMessage,
    getConversation,
};
