const Bid = require('./models/Bid');
const Message = require('./models/Message');

module.exports = function socketHandler(io) {
    io.on('connection', (socket) => {
        // Join user-specific room for direct notifications.
        socket.on('join_user_room', (userId) => {
            if (userId) {
                const room = `user:${String(userId)}`;
                socket.join(room);
                console.log(`[Socket] ${socket.id} joined room "${room}"`);
            }
        });

        // ── Join a trade room (auction/negotiation) ──
        socket.on('join_trade_room', (listingId) => {
            if (listingId) {
                socket.join(String(listingId));
            }
        });

        // ── Place Bid ──
        socket.on('place_bid', async (data) => {
            try {
                const { listingId, buyerId, farmerId, amount } = data;
                if (!listingId || !buyerId || !farmerId || amount == null) return;

                const bid = await Bid.create({ listingId, buyerId, farmerId, amount });
                const populated = await Bid.findById(bid._id)
                    .populate('buyerId', 'name phone')
                    .populate('farmerId', 'name phone');

                io.to(String(listingId)).emit('new_bid', populated);
            } catch (err) {
                socket.emit('error_event', { message: err.message });
            }
        });

        // ── Send Message ──
        socket.on('send_message', async (data) => {
            try {
                const { listingId, senderId, receiverId, text } = data;
                if (!listingId || !senderId || !receiverId || !text) return;

                const msg = await Message.create({ listingId, senderId, receiverId, text });
                const populated = await Message.findById(msg._id)
                    .populate('senderId', 'name phone')
                    .populate('receiverId', 'name phone');

                io.to(String(listingId)).emit('new_message', populated);
            } catch (err) {
                socket.emit('error_event', { message: err.message });
            }
        });

        // ── Update Bid Status (Farmer accepts / rejects) ──
        socket.on('update_bid_status', async (data) => {
            try {
                const { bidId, status } = data;
                if (!bidId || !['Accepted', 'Rejected'].includes(status)) return;

                const updatePayload = { status };
                if (status === 'Accepted') {
                    updatePayload.acceptedAt = new Date();
                    updatePayload.expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
                }

                const bid = await Bid.findByIdAndUpdate(
                    bidId,
                    updatePayload,
                    { new: true }
                ).populate('buyerId', 'name phone').populate('farmerId', 'name phone');

                if (bid) {
                    io.to(String(bid.listingId)).emit('bid_status_updated', bid);
                }
            } catch (err) {
                socket.emit('error_event', { message: err.message });
            }
        });

        socket.on('disconnect', () => {});
    });
};
