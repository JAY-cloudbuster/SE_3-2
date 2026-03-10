const asyncHandler = require('express-async-handler');
const Bid = require('../models/Bid');
const Crop = require('../models/Crop');
const { createNotification } = require('../utils/notificationEmitter');

const placeBid = asyncHandler(async (req, res) => {
    const { listingId, buyerId, amount, quantity } = req.body;

    if (!listingId || !buyerId || amount == null) {
        res.status(400);
        throw new Error('listingId, buyerId, and amount are required');
    }

    if (String(req.user.id) !== String(buyerId)) {
        res.status(403);
        throw new Error('You can only place bids as yourself');
    }

    const crop = await Crop.findById(listingId);
    if (!crop) {
        res.status(404);
        throw new Error('Listing not found');
    }

    if (crop.isSold || crop.status === 'Sold') {
        res.status(400);
        throw new Error('This listing is no longer available');
    }

    const bid = await Bid.create({
        listingId,
        buyerId,
        farmerId: crop.farmer,
        amount,
        quantity,
        status: 'Pending',
    });

    await createNotification({
        userId: crop.farmer,
        role: 'FARMER',
        title: 'New Bid Received',
        message: `${req.user.name || 'A buyer'} placed a bid of Rs.${amount}/quintal for ${crop.name}.`,
        type: 'bid',
    });

    const populated = await Bid.findById(bid._id)
        .populate('buyerId', 'name phone')
        .populate('farmerId', 'name phone')
        .populate('listingId', 'name quantity price quality');

    res.status(201).json(populated);
});

const getBidsByListing = asyncHandler(async (req, res) => {
    const bids = await Bid.find({ listingId: req.params.listingId })
        .populate('buyerId', 'name phone')
        .populate('farmerId', 'name phone')
        .sort({ amount: -1, createdAt: -1 });

    res.status(200).json(bids);
});

const updateBidStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!['Accepted', 'Rejected'].includes(status)) {
        res.status(400);
        throw new Error('status must be Accepted or Rejected');
    }

    const bid = await Bid.findById(req.params.bidId);
    if (!bid) {
        res.status(404);
        throw new Error('Bid not found');
    }

    if (String(bid.farmerId) !== String(req.user.id)) {
        res.status(403);
        throw new Error('Only the farmer for this listing can update bid status');
    }

    bid.status = status;
    if (status === 'Accepted') {
        bid.acceptedAt = new Date();
        bid.expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    }
    await bid.save();

    const listing = await Crop.findById(bid.listingId).select('name');
    await createNotification({
        userId: bid.buyerId,
        role: 'BUYER',
        title: status === 'Accepted' ? 'Bid Accepted' : 'Bid Rejected',
        message:
            status === 'Accepted'
                ? `Your bid of Rs.${bid.amount}/quintal for ${listing?.name || 'crop'} was accepted.`
                : `Your bid of Rs.${bid.amount}/quintal for ${listing?.name || 'crop'} was rejected.`,
        type: 'bid',
    });

    const populated = await Bid.findById(bid._id)
        .populate('buyerId', 'name phone')
        .populate('farmerId', 'name phone')
        .populate('listingId', 'name quantity price quality');

    res.status(200).json(populated);
});

module.exports = {
    placeBid,
    getBidsByListing,
    updateBidStatus,
};
