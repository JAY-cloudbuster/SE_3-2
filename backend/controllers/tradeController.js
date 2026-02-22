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

    // Update crop price to highest bid
    crop.price = amount;
    await crop.save();

    res.status(200).json({
        message: 'Bid placed successfully',
        cropId: crop._id,
        newPrice: amount,
        bidder: req.user.id
    });
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
    const { cropId, quantity, paymentMethod, shippingAddress, negotiationId } = req.body;

    if (!cropId || !paymentMethod || !shippingAddress) {
        res.status(400);
        throw new Error('Crop ID, payment method, and shipping address are required');
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
    let orderQuantity = quantity || crop.quantity;

    // If order is from an accepted negotiation, use negotiated price
    if (negotiationId) {
        const negotiation = await Negotiation.findById(negotiationId);
        if (negotiation && negotiation.status === 'accepted' && negotiation.finalPrice) {
            pricePerKg = negotiation.finalPrice;
        }
    }

    const itemTotal = orderQuantity * pricePerKg;
    const shippingCost = 0; // Free shipping

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
        shippingAddress
    });

    // Mark crop as sold
    crop.isSold = true;
    crop.status = 'Sold';
    await crop.save();

    const populated = await Order.findById(order._id)
        .populate('buyer', 'name phone')
        .populate('farmer', 'name phone');

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
    startNegotiation,
    sendOffer,
    acceptNegotiation,
    rejectNegotiation,
    createOrder,
    getOrders,
    updateOrderStatus
};
