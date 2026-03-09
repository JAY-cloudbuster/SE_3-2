/**
 * @fileoverview Trade Controller for AgriSahayak Platform
 * 
 * Handles all trade-related operations: bidding, negotiations,
 * order creation, and order status management.
 * 
 * @module controllers/tradeController
 * @requires express-async-handler
 * @requires models/Crop
 * @requires models/Order
 * @requires models/Negotiation
 * 
 * @see Epic 4 - Trade & Auction
 */

const asyncHandler = require('express-async-handler');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const Negotiation = require('../models/Negotiation');
const Bid = require('../models/Bid');
const User = require('../models/User');
const { encryptPaymentDetails } = require('../utils/paymentCrypto');

/**
 * Place a Bid on an Auction-type Crop
 * 
 * @route POST /api/trade/bid
 * @access Private
 */
const placeBid = asyncHandler(async (req, res) => {
    const { cropId, amount } = req.body;

    if (!cropId || !amount) {
        res.status(400);
        throw new Error('Crop ID and bid amount are required');
    }

    const crop = await Crop.findById(cropId);
    if (!crop) {
        res.status(404);
        throw new Error('Crop not found');
    }

    if (crop.isSold || crop.status === 'Sold') {
        res.status(400);
        throw new Error('This crop has already been sold');
    }

    // Bid must be higher than current price
    if (amount <= crop.price) {
        res.status(400);
        throw new Error(`Bid must be higher than current price of ₹${crop.price}`);
    }

    const bid = await Bid.create({
        listingId: crop._id,
        buyerId: req.user.id,
        farmerId: crop.farmer,
        amount,
        status: 'Pending'
    });

    // Update crop price to highest bid
    crop.price = amount;
    await crop.save();

    res.status(200).json({
        message: 'Bid placed successfully',
        bid,
        cropId: crop._id,
        newPrice: amount,
        bidder: req.user.id
    });
});

/**
 * Get Incoming Bids for Farmer
 *
 * @route GET /api/trade/bids/incoming
 * @access Private (Farmer)
 */
const getIncomingBids = asyncHandler(async (req, res) => {
    const bids = await Bid.find({ farmerId: req.user.id })
        .populate('buyerId', 'name phone')
        .populate('listingId', 'name quantity price quality')
        .sort({ createdAt: -1 });

    res.status(200).json(bids);
});

/**
 * Get Accepted Bids for Buyer
 *
 * @route GET /api/trade/bids/accepted
 * @access Private (Buyer)
 */
const getAcceptedBidsForBuyer = asyncHandler(async (req, res) => {
    await Bid.updateMany(
        {
            buyerId: req.user.id,
            status: 'Accepted',
            expiresAt: { $lt: new Date() }
        },
        {
            $set: { status: 'Expired' }
        }
    );

    const bids = await Bid.find({
        buyerId: req.user.id,
        status: 'Accepted',
        expiresAt: { $gte: new Date() }
    })
        .populate('farmerId', 'name phone')
        .populate('listingId', 'name quantity price quality image location')
        .sort({ updatedAt: -1 });

    res.status(200).json(bids);
});

/**
 * Get Buyer Bid History (posted/accepted/failed/expired/completed)
 *
 * @route GET /api/trade/bids/history
 * @access Private (Buyer)
 */
const getBidHistoryForBuyer = asyncHandler(async (req, res) => {
    await Bid.updateMany(
        {
            buyerId: req.user.id,
            status: 'Accepted',
            expiresAt: { $lt: new Date() }
        },
        {
            $set: { status: 'Expired' }
        }
    );

    const bids = await Bid.find({ buyerId: req.user.id })
        .populate('farmerId', 'name phone')
        .populate('listingId', 'name quantity price quality image location')
        .sort({ createdAt: -1 });

    res.status(200).json(bids);
});

/**
 * Update Bid Status
 *
 * @route PUT /api/trade/bids/:id/status
 * @access Private (Farmer)
 */
const updateBidStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!status || !['Accepted', 'Rejected'].includes(status)) {
        res.status(400);
        throw new Error('Status must be Accepted or Rejected');
    }

    const bid = await Bid.findById(req.params.id);
    if (!bid) {
        res.status(404);
        throw new Error('Bid not found');
    }

    if (bid.farmerId.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized to update this bid');
    }

    bid.status = status;
    if (status === 'Accepted') {
        bid.acceptedAt = new Date();
        bid.expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    }
    await bid.save();

    const populated = await Bid.findById(bid._id)
        .populate('buyerId', 'name phone')
        .populate('listingId', 'name quantity price quality');

    res.status(200).json(populated);
});

/**
 * Start a New Negotiation
 * 
 * @route POST /api/trade/negotiation/start
 * @access Private (Buyer)
 */
const startNegotiation = asyncHandler(async (req, res) => {
    const { cropId, message, offerAmount } = req.body;

    if (!cropId) {
        res.status(400);
        throw new Error('Crop ID is required');
    }

    const crop = await Crop.findById(cropId).populate('farmer');
    if (!crop) {
        res.status(404);
        throw new Error('Crop not found');
    }

    if (crop.farmer._id.toString() === req.user.id) {
        res.status(400);
        throw new Error('You cannot negotiate on your own crop');
    }

    // Check if an active negotiation already exists
    const existingNegotiation = await Negotiation.findOne({
        crop: cropId,
        buyer: req.user.id,
        status: 'active'
    });

    if (existingNegotiation) {
        res.status(400);
        throw new Error('You already have an active negotiation for this crop');
    }

    const negotiation = await Negotiation.create({
        crop: cropId,
        buyer: req.user.id,
        farmer: crop.farmer._id,
        messages: [{
            sender: req.user.id,
            content: message || `I'd like to negotiate for ${crop.name}`,
            type: offerAmount ? 'offer' : 'text',
            offerAmount: offerAmount || undefined
        }]
    });

    const populated = await Negotiation.findById(negotiation._id)
        .populate('buyer', 'name phone')
        .populate('farmer', 'name phone')
        .populate('crop', 'name price');

    res.status(201).json(populated);
});

/**
 * Send an Offer/Message in an Existing Negotiation
 * 
 * @route POST /api/trade/negotiation/offer
 * @access Private
 */
const sendOffer = asyncHandler(async (req, res) => {
    const { negotiationId, message, amount } = req.body;

    if (!negotiationId) {
        res.status(400);
        throw new Error('Negotiation ID is required');
    }

    const negotiation = await Negotiation.findById(negotiationId);
    if (!negotiation) {
        res.status(404);
        throw new Error('Negotiation not found');
    }

    if (negotiation.status !== 'active') {
        res.status(400);
        throw new Error('This negotiation is no longer active');
    }

    // Verify user is part of this negotiation
    const userId = req.user.id;
    if (negotiation.buyer.toString() !== userId && negotiation.farmer.toString() !== userId) {
        res.status(403);
        throw new Error('You are not part of this negotiation');
    }

    const newMessage = {
        sender: userId,
        content: message || `Offer: ₹${amount}`,
        type: amount ? 'offer' : 'text',
        offerAmount: amount || undefined
    };

    negotiation.messages.push(newMessage);
    negotiation.lastActivity = Date.now();
    await negotiation.save();

    res.status(200).json(negotiation);
});

/**
 * Accept a Negotiation
 * 
 * @route PUT /api/trade/negotiation/:id/accept
 * @access Private (Farmer)
 */
const acceptNegotiation = asyncHandler(async (req, res) => {
    const negotiation = await Negotiation.findById(req.params.id);

    if (!negotiation) {
        res.status(404);
        throw new Error('Negotiation not found');
    }

    if (negotiation.farmer.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Only the farmer can accept a negotiation');
    }

    if (negotiation.status !== 'active') {
        res.status(400);
        throw new Error('This negotiation is no longer active');
    }

    // Find the last offer amount
    const lastOffer = [...negotiation.messages]
        .reverse()
        .find(m => m.type === 'offer');

    negotiation.status = 'accepted';
    negotiation.finalPrice = lastOffer ? lastOffer.offerAmount : null;
    negotiation.lastActivity = Date.now();
    await negotiation.save();

    res.status(200).json({
        message: 'Negotiation accepted',
        negotiation
    });
});

/**
 * Reject a Negotiation
 * 
 * @route PUT /api/trade/negotiation/:id/reject
 * @access Private (Farmer)
 */
const rejectNegotiation = asyncHandler(async (req, res) => {
    const negotiation = await Negotiation.findById(req.params.id);

    if (!negotiation) {
        res.status(404);
        throw new Error('Negotiation not found');
    }

    if (negotiation.farmer.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Only the farmer can reject a negotiation');
    }

    if (negotiation.status !== 'active') {
        res.status(400);
        throw new Error('This negotiation is no longer active');
    }

    negotiation.status = 'rejected';
    negotiation.lastActivity = Date.now();
    await negotiation.save();

    res.status(200).json({
        message: 'Negotiation rejected',
        negotiation
    });
});

/**
 * Create an Order (Buy Now or from accepted negotiation)
 * 
 * @route POST /api/trade/orders
 * @access Private (Buyer)
 */
const createOrder = asyncHandler(async (req, res) => {
    const { cropId, quantity, paymentMethod, shippingAddress, negotiationId, bidId, paymentDetails } = req.body;

    if (!cropId || !paymentMethod || !shippingAddress) {
        res.status(400);
        throw new Error('Crop ID, payment method, and shipping address are required');
    }

    if (paymentMethod !== 'cod' && (!paymentDetails || Object.keys(paymentDetails).length === 0)) {
        res.status(400);
        throw new Error('Payment details are required for online payment');
    }

    const crop = await Crop.findById(cropId).populate('farmer');
    if (!crop) {
        res.status(404);
        throw new Error('Crop not found');
    }

    if (crop.isSold || crop.status === 'Sold') {
        res.status(400);
        throw new Error('This crop is no longer available');
    }

    let pricePerKg = crop.price;
    const orderQuantity = Number(quantity || 0);

    if (!orderQuantity || orderQuantity <= 0) {
        res.status(400);
        throw new Error('Valid quantity is required');
    }

    if (orderQuantity > crop.quantity) {
        res.status(400);
        throw new Error(`Only ${crop.quantity} quintal(s) available for this crop`);
    }

    let linkedBid = null;

    // If order is from an accepted bid, enforce buyer ownership and 2-hour expiry.
    if (bidId) {
        linkedBid = await Bid.findById(bidId);
        if (!linkedBid) {
            res.status(404);
            throw new Error('Bid not found');
        }

        if (linkedBid.buyerId.toString() !== req.user.id) {
            res.status(403);
            throw new Error('You are not authorized to checkout this bid');
        }

        if (linkedBid.listingId.toString() !== crop._id.toString()) {
            res.status(400);
            throw new Error('Bid does not belong to this crop listing');
        }

        if (linkedBid.status !== 'Accepted') {
            res.status(400);
            throw new Error('Only accepted bids can proceed to payment');
        }

        if (!linkedBid.expiresAt || new Date(linkedBid.expiresAt) < new Date()) {
            res.status(400);
            throw new Error('Bid payment window expired. Please place a new bid.');
        }

        pricePerKg = linkedBid.amount;
    }

    // If order is from an accepted negotiation, use negotiated price
    if (negotiationId) {
        const negotiation = await Negotiation.findById(negotiationId);
        if (negotiation && negotiation.status === 'accepted' && negotiation.finalPrice) {
            pricePerKg = negotiation.finalPrice;
        }
    }

    const itemTotal = orderQuantity * pricePerKg;
    const shippingCost = 0; // Free shipping
    const encryptedPayment = encryptPaymentDetails(paymentDetails || {});

    const order = await Order.create({
        buyer: req.user.id,
        farmer: crop.farmer._id,
        items: [{
            crop: crop._id,
            name: crop.name,
            quantity: orderQuantity,
            pricePerKg,
            total: itemTotal
        }],
        totalAmount: itemTotal + shippingCost,
        shippingCost,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        shippingAddress,
        paymentDetailsEncrypted: encryptedPayment.encrypted,
        paymentDetailsIv: encryptedPayment.iv,
        paymentDetailsTag: encryptedPayment.tag,
        sourceBid: linkedBid ? linkedBid._id : undefined
    });

    // Decrement available crop quantity on successful purchase.
    crop.quantity = Math.max(0, crop.quantity - orderQuantity);
    if (crop.quantity === 0) {
        crop.isSold = true;
        crop.status = 'Sold';
    }
    await crop.save();

    // Save delivery address user-wise for reuse.
    await User.findByIdAndUpdate(
        req.user.id,
        { $addToSet: { savedAddresses: shippingAddress } },
        { new: true }
    );

    if (linkedBid) {
        linkedBid.status = 'Completed';
        linkedBid.expiresAt = new Date();
        await linkedBid.save();
    }

    const populated = await Order.findById(order._id)
        .populate('buyer', 'name phone')
        .populate('farmer', 'name phone');

    if (order.paymentStatus === 'paid') {
        const io = req.app.get('io');
        if (io) {
            const paymentEvent = {
                orderId: populated._id,
                sourceBidId: linkedBid?._id || null,
                listingId: crop._id,
                cropName: crop.name,
                buyer: {
                    id: populated.buyer?._id,
                    name: populated.buyer?.name || 'Buyer',
                    phone: populated.buyer?.phone || ''
                },
                farmerId: populated.farmer?._id,
                amount: populated.totalAmount,
                quantity: orderQuantity,
                paymentStatus: 'completed',
                completedAt: new Date().toISOString(),
                type: linkedBid ? 'accepted_bid_payment_completed' : 'buy_now_payment_completed'
            };

            // Farmer dashboard listeners can subscribe to user:<farmerId>.
            io.to(`user:${String(populated.farmer?._id)}`).emit('payment_completed', paymentEvent);

            if (linkedBid) {
                // Keep trade room participants informed about accepted bid settlement.
                io.to(String(linkedBid.listingId)).emit('accepted_bid_payment_completed', paymentEvent);
            }
        }
    }

    res.status(201).json(populated);
});

/**
 * Get Orders for Current User
 * 
 * @route GET /api/trade/orders
 * @access Private
 */
const getOrders = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const orders = await Order.find({
        $or: [{ buyer: userId }, { farmer: userId }]
    })
        .populate('buyer', 'name phone')
        .populate('farmer', 'name phone')
        .populate('items.crop', 'name image')
        .sort({ createdAt: -1 });

    res.status(200).json(orders);
});

/**
 * Update Order Status
 * 
 * @route PUT /api/trade/orders/:id
 * @access Private (Farmer who owns the order)
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!status) {
        res.status(400);
        throw new Error('Status is required');
    }

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Only the farmer or admin can update order status
    if (order.farmer.toString() !== req.user.id && req.user.role !== 'ADMIN') {
        res.status(403);
        throw new Error('Not authorized to update this order');
    }

    order.orderStatus = status;
    await order.save();

    const populated = await Order.findById(order._id)
        .populate('buyer', 'name phone')
        .populate('farmer', 'name phone');

    res.status(200).json(populated);
});

module.exports = {
    placeBid,
    getIncomingBids,
    getAcceptedBidsForBuyer,
    getBidHistoryForBuyer,
    updateBidStatus,
    startNegotiation,
    sendOffer,
    acceptNegotiation,
    rejectNegotiation,
    createOrder,
    getOrders,
    updateOrderStatus
};
