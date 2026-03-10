const asyncHandler = require('express-async-handler');
const Bid = require('../models/Bid');
const Message = require('../models/Message');
const Crop = require('../models/Crop');

/**
 * GET /api/bidmessage/bids/:listingId
 * Returns all bids for a crop listing, sorted highest first.
 */
const getBidsForListing = asyncHandler(async (req, res) => {
    const bids = await Bid.find({ listingId: req.params.listingId })
        .populate('buyerId', 'name phone')
        .populate('farmerId', 'name phone')
        .sort({ amount: -1 });
    res.json(bids);
});

/**
 * GET /api/bidmessage/messages/:listingId
 * Returns all chat messages for a crop listing, sorted oldest first.
 */
const getMessagesForListing = asyncHandler(async (req, res) => {
    const messages = await Message.find({ listingId: req.params.listingId })
        .populate('senderId', 'name phone')
        .populate('receiverId', 'name phone')
        .sort({ createdAt: 1 });
    res.json(messages);
});

/**
 * POST /api/bidmessage/messages
 * REST endpoint to send a chat message.
 * Saves to DB then pushes via socket (if connected) so both sides update in real-time.
 * Body: { listingId, receiverId, text }
 */
const sendMessage = asyncHandler(async (req, res) => {
    const { listingId, receiverId, text } = req.body;

    if (!listingId || !receiverId || !text?.trim()) {
        res.status(400);
        throw new Error('listingId, receiverId, and text are required');
    }

    const msg = await Message.create({
        listingId,
        senderId: req.user._id,
        receiverId,
        text: text.trim(),
    });

    const populated = await Message.findById(msg._id)
        .populate('senderId', 'name phone')
        .populate('receiverId', 'name phone');

    // Push real-time update via socket (if available) — optional enhancement
    const io = req.app.get('io');
    if (io) {
        io.to(String(listingId)).emit('new_message', populated);
    }

    res.status(201).json(populated);
});

/**
 * GET /api/bidmessage/inbox
 * Farmer inbox: returns all unique conversations (grouped by listingId)
 * where the authenticated farmer's crops have received messages.
 * Response: [{ listingId, cropName, cropImage, buyerId, buyerName, lastMessage, lastTime, unreadCount }]
 */
const getFarmerInbox = asyncHandler(async (req, res) => {
    // Get all crops belonging to this farmer
    const crops = await Crop.find({ farmer: req.user._id }).select('_id name image');
    const cropIds = crops.map(c => c._id);
    const cropMap = {};
    crops.forEach(c => { cropMap[String(c._id)] = c; });

    if (cropIds.length === 0) return res.json([]);

    // Get all messages for any of those crops, newest first
    const messages = await Message.find({ listingId: { $in: cropIds } })
        .populate('senderId', 'name phone')
        .populate('receiverId', 'name phone')
        .sort({ createdAt: -1 });

    // Group by listingId + buyerId pair (each buyer-crop combo = one conversation)
    const conversationMap = {};
    for (const msg of messages) {
        const lid = String(msg.listingId);
        const buyerDoc = String(msg.senderId?._id) !== String(req.user._id)
            ? msg.senderId
            : msg.receiverId;
        const key = `${lid}__${String(buyerDoc?._id)}`;

        if (!conversationMap[key]) {
            conversationMap[key] = {
                listingId: lid,
                cropName: cropMap[lid]?.name || 'Crop',
                cropImage: cropMap[lid]?.image || null,
                buyerId: buyerDoc?._id,
                buyerName: buyerDoc?.name || buyerDoc?.phone || 'Buyer',
                lastMessage: msg.text,
                lastTime: msg.createdAt,
                unreadCount: 0,
            };
        }
        // Count messages the farmer hasn't sent (i.e. from buyer) as "unread" signal
        if (String(msg.senderId?._id) !== String(req.user._id)) {
            conversationMap[key].unreadCount += 1;
        }
    }

    const inbox = Object.values(conversationMap).sort(
        (a, b) => new Date(b.lastTime) - new Date(a.lastTime)
    );

    res.json(inbox);
});

module.exports = { getBidsForListing, getMessagesForListing, sendMessage, getFarmerInbox };
