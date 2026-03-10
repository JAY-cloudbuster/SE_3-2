const asyncHandler = require('express-async-handler');
const Bid = require('../models/Bid');
const Message = require('../models/Message');

const getBidsForListing = asyncHandler(async (req, res) => {
    const bids = await Bid.find({ listingId: req.params.listingId })
        .populate('buyerId', 'name phone')
        .populate('farmerId', 'name phone')
        .sort({ amount: -1 });
    res.json(bids);
});

const getMessagesForListing = asyncHandler(async (req, res) => {
    const messages = await Message.find({ listingId: req.params.listingId })
        .populate('senderId', 'name phone')
        .populate('receiverId', 'name phone')
        .sort({ createdAt: 1 });
    res.json(messages);
});

module.exports = { getBidsForListing, getMessagesForListing };
